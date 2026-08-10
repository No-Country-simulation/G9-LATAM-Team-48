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

@Service
public class RecommendationHistoryService {

    private final RecommendationRepository catalogRepository;
    private final UserRecommendationRepository userRecRepository;

    public RecommendationHistoryService(RecommendationRepository catalogRepository,
                                        UserRecommendationRepository userRecRepository) {
        this.catalogRepository = catalogRepository;
        this.userRecRepository = userRecRepository;
    }

    @Transactional
    public List<RecommendationEntity> filterAndPersistNovedades(String userId, Set<TipKey> candidateKeys) {
        
        List<TipKey> activeUserKeysList = userRecRepository.findTipKeysByUserIdAndStatus(userId, RecommendationStatus.ACTIVE);
        Set<TipKey> activeUserKeysSet = new HashSet<>(activeUserKeysList);

        List<TipKey> newKeys = candidateKeys.stream()
                .filter(key -> !activeUserKeysSet.contains(key))
                .toList();

        List<RecommendationEntity> finalEntities = new ArrayList<>();

        if (!newKeys.isEmpty()) {
            Map<TipKey, RecommendationEntity> catalogMap = catalogRepository.findByTipKeyIn(newKeys).stream()
                    .collect(Collectors.toMap(
                            (RecommendationEntity entity) -> entity.getTipKey(), 
                            entity -> entity,
                            (existing, replacement) -> existing
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