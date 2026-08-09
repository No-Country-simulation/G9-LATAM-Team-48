package com.alura.recommendation.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
import com.alura.recommendation.model.RecommendationStatus;
import com.alura.recommendation.model.UserRecommendationEntity;
import com.alura.recommendation.repository.RecommendationRepository;
import com.alura.recommendation.repository.UserRecommendationRepository;
import com.alura.recommendation.rules.RecommendationRule;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio principal del motor de recomendaciones con lógica antiduplicados y soporte SHAP.
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;
    private final RecommendationRepository catalogRepository;
    private final UserRecommendationRepository userRecRepository;

    public RecommendationServiceImpl(List<RecommendationRule> rules,
                                     RecommendationRepository catalogRepository,
                                     UserRecommendationRepository userRecRepository) {
        this.rules = rules.stream()
                .sorted(Comparator.comparingInt((RecommendationRule r) -> r.getOrder()))
                .toList();
        this.catalogRepository = catalogRepository;
        this.userRecRepository = userRecRepository;
    }

    @Override
    @Transactional
    public RecommendationResponse generateRecommendations(RecommendationRequest request) {
        if (request == null || request.getCategory() == null || request.getUserId() == null) {
            throw new IllegalArgumentException("El request, userId y la categoría son obligatorios");
        }

        ConsumptionCategory category = request.getCategory();
        Set<TipKey> candidateKeys = new LinkedHashSet<>(); 

        // 1. Inyectamos la Recomendación Base por Categoría (Nivel 1)
        candidateKeys.add(category.getBaseTipKey());

        // 2. Evaluamos reglas dinámicas SHAP (Nivel 2) si la categoría lo amerita
        if (category.isRequiresDetailedAnalysis()) {
            for (RecommendationRule rule : rules) {
                if (rule.applies(request)) {
                    rule.evaluate(request).ifPresent(item -> candidateKeys.add(item.getTipKey()));
                }
            }
        }

        // 3. CONSULTA BDD: Buscamos qué recomendaciones ya tiene ACTIVAS este usuario
        List<TipKey> activeUserKeys = userRecRepository.findTipKeysByUserIdAndStatus(
                request.getUserId(), RecommendationStatus.ACTIVE);

        // 4. FILTRO ANTIDUPLICADOS: Dejamos solo los candidatos que NO están activos en la BDD
        List<TipKey> newKeys = candidateKeys.stream()
                .filter(key -> !activeUserKeys.contains(key))
                .toList();

        List<RecommendationItem> finalItems = new ArrayList<>();

        // 5. PERSISTENCIA: Si hay novedades, buscamos su definición en el catálogo y las guardamos
        if (!newKeys.isEmpty()) {
            Map<TipKey, RecommendationEntity> catalogMap = catalogRepository.findByTipKeyIn(newKeys).stream()
                    .collect(Collectors.toMap(
                            (RecommendationEntity entity) -> entity.getTipKey(), 
                            entity -> entity
                    ));

            List<UserRecommendationEntity> newRecords = new ArrayList<>();

            for (TipKey key : newKeys) {
                RecommendationEntity catalogEntity = catalogMap.get(key);
                if (catalogEntity != null) {
                    
                    finalItems.add(RecommendationItem.builder()
                            .tipKey(key)
                            .type(catalogEntity.getType())
                            .priority(determinePriority(key, category))
                            .build());

                    newRecords.add(UserRecommendationEntity.builder()
                            .userId(request.getUserId())
                            .recommendation(catalogEntity)
                            .status(RecommendationStatus.ACTIVE)
                            .build());
                }
            }
            
            userRecRepository.saveAll(newRecords);
        }

        return RecommendationResponse.builder()
                .userId(request.getUserId())
                .category(category)
                .categoryFrontendKey(category.getFrontendKey())
                .recommendations(finalItems)
                .build();
    }

    private String determinePriority(TipKey key, ConsumptionCategory category) {
        if (category == ConsumptionCategory.INEFICIENTE) return "HIGH";
        if (category == ConsumptionCategory.EFICIENTE) return "LOW";
        return "MEDIUM";
    }
}