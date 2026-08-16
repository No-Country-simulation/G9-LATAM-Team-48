package com.alura.recommendation.service;

import com.alura.recommendation.persistence.RecommendationCatalogEntity;
import com.alura.recommendation.persistence.RecommendationCatalogRepository;
import com.alura.recommendation.persistence.UserRecommendationEntity;
import com.alura.recommendation.persistence.UserRecommendationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserRecommendationSyncAntiduplicateTest {

    @Mock
    RecommendationCatalogRepository catalogRepository;

    @Mock
    UserRecommendationRepository userRecommendationRepository;

    LegacyTipCatalogMapper legacyTipCatalogMapper;
    UserRecommendationSyncService syncService;

    @BeforeEach
    void setUp() {
        legacyTipCatalogMapper = new LegacyTipCatalogMapper();
        syncService = new UserRecommendationSyncService(
                catalogRepository, userRecommendationRepository, legacyTipCatalogMapper);
    }

    @Test
    @DisplayName("No inserta duplicados ACTIVE para el mismo usuario y tip del catálogo")
    void syncFromAnalysisTips_skipsExistingActiveRows() {
        RecommendationCatalogEntity catalog = new RecommendationCatalogEntity();
        catalog.setId(7L);
        catalog.setTipKey("HIGH_CONSUMPTION_PER_PERSON");

        UserRecommendationEntity existing = new UserRecommendationEntity();
        existing.setUserId("user@test.com");
        existing.setRecommendation(catalog);
        existing.setStatus(UserRecommendationEntity.STATUS_ACTIVE);

        when(catalogRepository.findByTipKeyIgnoreCase("HIGH_CONSUMPTION_PER_PERSON"))
                .thenReturn(Optional.of(catalog));
        when(userRecommendationRepository.findByUserIdAndRecommendation_IdAndStatus(
                eq("user@test.com"), eq(7L), eq(UserRecommendationEntity.STATUS_ACTIVE)))
                .thenReturn(Optional.of(existing));

        syncService.syncFromAnalysisTips("user@test.com", List.of("occupancy", "occupancy"));

        verify(userRecommendationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Persiste solo tips nuevas no presentes en el historial ACTIVE")
    void syncFromAnalysisTips_persistsOnlyNewTips() {
        RecommendationCatalogEntity occupancy = catalogRow(1L, "HIGH_CONSUMPTION_PER_PERSON");
        RecommendationCatalogEntity led = catalogRow(2L, "LED_UPGRADE_NEEDED");

        when(catalogRepository.findByTipKeyIgnoreCase("HIGH_CONSUMPTION_PER_PERSON"))
                .thenReturn(Optional.of(occupancy));
        when(catalogRepository.findByTipKeyIgnoreCase("LED_UPGRADE_NEEDED"))
                .thenReturn(Optional.of(led));
        when(userRecommendationRepository.findByUserIdAndRecommendation_IdAndStatus(
                eq("user@test.com"), eq(1L), eq(UserRecommendationEntity.STATUS_ACTIVE)))
                .thenReturn(Optional.of(activeRow("user@test.com", occupancy)));
        when(userRecommendationRepository.findByUserIdAndRecommendation_IdAndStatus(
                eq("user@test.com"), eq(2L), eq(UserRecommendationEntity.STATUS_ACTIVE)))
                .thenReturn(Optional.empty());
        when(catalogRepository.findById(2L)).thenReturn(Optional.of(led));
        when(userRecommendationRepository.save(any(UserRecommendationEntity.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        syncService.syncFromAnalysisTips("user@test.com", List.of("occupancy", "led"));

        ArgumentCaptor<UserRecommendationEntity> captor = ArgumentCaptor.forClass(UserRecommendationEntity.class);
        verify(userRecommendationRepository).save(captor.capture());
        assertEquals(2L, captor.getValue().getRecommendation().getId());
        assertEquals("user@test.com", captor.getValue().getUserId());
        assertEquals(UserRecommendationEntity.STATUS_ACTIVE, captor.getValue().getStatus());
    }

    private static RecommendationCatalogEntity catalogRow(long id, String tipKey) {
        RecommendationCatalogEntity entity = new RecommendationCatalogEntity();
        entity.setId(id);
        entity.setTipKey(tipKey);
        return entity;
    }

    private static UserRecommendationEntity activeRow(String userId, RecommendationCatalogEntity catalog) {
        UserRecommendationEntity row = new UserRecommendationEntity();
        row.setUserId(userId);
        row.setRecommendation(catalog);
        row.setStatus(UserRecommendationEntity.STATUS_ACTIVE);
        return row;
    }
}
