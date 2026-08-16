package com.alura.recommendation.service;

import com.alura.recommendation.persistence.RecommendationCatalogEntity;
import com.alura.recommendation.persistence.RecommendationCatalogRepository;
import com.alura.recommendation.persistence.UserRecommendationEntity;
import com.alura.recommendation.persistence.UserRecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserRecommendationSyncService {

    private final RecommendationCatalogRepository catalogRepository;
    private final UserRecommendationRepository userRecommendationRepository;
    private final LegacyTipCatalogMapper legacyTipCatalogMapper;

    public UserRecommendationSyncService(
            RecommendationCatalogRepository catalogRepository,
            UserRecommendationRepository userRecommendationRepository,
            LegacyTipCatalogMapper legacyTipCatalogMapper) {
        this.catalogRepository = catalogRepository;
        this.userRecommendationRepository = userRecommendationRepository;
        this.legacyTipCatalogMapper = legacyTipCatalogMapper;
    }

    /**
     * Persiste recomendaciones ACTIVE solo para usuario autenticado (email JWT).
     * El analisis anonimo no escribe en {@code user_recommendations}; el catalogo sigue en BD para GET /api/recomendaciones.
     */
    @Transactional
    public void syncFromAnalysisTips(String userId, List<String> legacyTipKeys) {
        if (userId == null || userId.isBlank() || legacyTipKeys == null || legacyTipKeys.isEmpty()) {
            return;
        }

        Set<Long> catalogIds = new LinkedHashSet<>();
        for (String legacy : legacyTipKeys) {
            String catalogTipKey = legacyTipCatalogMapper.catalogTipKeyForLegacy(legacy);
            catalogRepository.findByTipKeyIgnoreCase(catalogTipKey).ifPresent(c -> catalogIds.add(c.getId()));
        }

        for (Long catalogId : catalogIds) {
            userRecommendationRepository
                    .findByUserIdAndRecommendation_IdAndStatus(
                            userId, catalogId, UserRecommendationEntity.STATUS_ACTIVE)
                    .orElseGet(() -> {
                        RecommendationCatalogEntity catalog = catalogRepository
                                .findById(catalogId)
                                .orElseThrow();
                        UserRecommendationEntity row = new UserRecommendationEntity();
                        row.setUserId(userId);
                        row.setRecommendation(catalog);
                        row.setStatus(UserRecommendationEntity.STATUS_ACTIVE);
                        return userRecommendationRepository.save(row);
                    });
        }
    }
}
