package com.alura.recommendation.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.rules.RecommendationRule;

import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio principal (Orquestador) del motor de recomendaciones.
 * Evalúa las reglas dinámicas y delega la persistencia al HistoryService (SRP).
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;
    private final RecommendationHistoryService historyService;

    public RecommendationServiceImpl(List<RecommendationRule> rules,
                                     RecommendationHistoryService historyService) {
        this.rules = rules.stream()
                .sorted(Comparator.comparingInt((RecommendationRule r) -> r.getOrder()))
                .toList();
        this.historyService = historyService;
    }

    @Override
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

        // 3. Delegamos el cruce antiduplicados y la persistencia (Clean Code - SRP)
        List<RecommendationItem> finalItems = historyService.filterAndPersistNovedades(
                request.getUserId(), candidateKeys, category);

        return RecommendationResponse.builder()
                .userId(request.getUserId())
                .category(category)
                .categoryFrontendKey(category.getFrontendKey())
                .recommendations(finalItems)
                .build();
    }
}