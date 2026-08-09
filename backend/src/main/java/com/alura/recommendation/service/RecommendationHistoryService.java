package com.alura.recommendation.service;

import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
import com.alura.recommendation.model.RecommendationStatus;
import com.alura.recommendation.model.UserRecommendationEntity;
import com.alura.recommendation.repository.RecommendationRepository;
import com.alura.recommendation.repository.UserRecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio de soporte delegado para gestionar el ciclo de vida, filtrado antiduplicados O(1)
 * y persistencia en base de datos de las recomendaciones de un usuario.
 */
@Service
public class RecommendationHistoryService {

    private final RecommendationRepository catalogRepository;
    private final UserRecommendationRepository userRecRepository;

    public RecommendationHistoryService(RecommendationRepository catalogRepository,
                                        UserRecommendationRepository userRecRepository) {
        this.catalogRepository = catalogRepository;
        this.userRecRepository = userRecRepository;
    }

    /**
     * Filtra los candidatos usando un Set (O(1)) para descartar los activos y persiste las novedades.
     */
    @Transactional
    public List<RecommendationEntity> filterAndPersistNovedades(Long userId, Set<TipKey> candidateKeys) {
        
        // 1. CONSULTA BDD: Buscamos qué recomendaciones ya tiene ACTIVAS este usuario
        List<TipKey> activeUserKeysList = userRecRepository.findTipKeysByUserIdAndStatus(userId, RecommendationStatus.ACTIVE);
        
        // Convertimos a Set para garantizar búsqueda O(1) altamente eficiente en el hot-path
        Set<TipKey> activeUserKeysSet = new HashSet<>(activeUserKeysList);

        // 2. FILTRO ANTIDUPLICADOS O(1)
        List<TipKey> newKeys = candidateKeys.stream()
                .filter(key -> !activeUserKeysSet.contains(key))
                .toList();

        List<RecommendationEntity> finalEntities = new ArrayList<>();

        // 3. PERSISTENCIA: Si hay novedades, buscamos su definición en el catálogo y las guardamos
        if (!newKeys.isEmpty()) {
            Map<TipKey, RecommendationEntity> catalogMap = catalogRepository.findByTipKeyIn(newKeys).stream()
                    .collect(Collectors.toMap(
                            RecommendationEntity::getTipKey, 
                            entity -> entity
                    ));

            List<UserRecommendationEntity> newRecords = new ArrayList<>();

            for (TipKey key : newKeys) {
                RecommendationEntity catalogEntity = catalogMap.get(key);
                if (catalogEntity != null) {
                    
                    finalEntities.add(catalogEntity);

                    newRecords.add(UserRecommendationEntity.builder()
                            .userId(userId)
                            .recommendation(catalogEntity)
                            .status(RecommendationStatus.ACTIVE)
                            .build());
                }
            }
            
            userRecRepository.saveAll(newRecords);
        }

        return finalEntities;
    }
}