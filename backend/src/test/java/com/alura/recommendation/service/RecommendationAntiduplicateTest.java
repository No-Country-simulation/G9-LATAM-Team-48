package com.alura.recommendation.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
import com.alura.recommendation.model.RecommendationStatus;
import com.alura.recommendation.repository.RecommendationRepository;
import com.alura.recommendation.repository.UserRecommendationRepository;
import com.alura.recommendation.rules.HighOccupantConsumptionRule;
import com.alura.recommendation.rules.InsulationFromFormRule;
import com.alura.recommendation.rules.LedUpgradeRule;
import com.alura.recommendation.rules.RecommendationRule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class RecommendationAntiduplicateTest {

    private RecommendationServiceImpl recommendationService;
    private UserRecommendationRepository userRecommendationRepository;

    @BeforeEach
    void setUp() {
        RecommendationRepository recommendationRepository = Mockito.mock(RecommendationRepository.class);
        userRecommendationRepository = Mockito.mock(UserRecommendationRepository.class);

        RecommendationHistoryService historyService = new RecommendationHistoryService(
                recommendationRepository, userRecommendationRepository);

        List<RecommendationRule> rules = List.of(
                new HighOccupantConsumptionRule(),
                new InsulationFromFormRule(),
                new LedUpgradeRule()
        );

        recommendationService = new RecommendationServiceImpl(rules, historyService);

        when(recommendationRepository.findByTipKeyIn(any())).thenAnswer(invocation -> {
            List<TipKey> keys = invocation.getArgument(0);
            return keys.stream().map(key -> RecommendationEntity.builder()
                    .tipKey(key)
                    .title("Título oficial para " + key.name())
                    .type(key.name().contains("HIGH") || key.name().contains("DEFICIENT") ? "ALERTA" : "OPORTUNIDAD")
                    .build()).toList();
        });
    }

    @Test
    @DisplayName("Debe filtrar y no retornar recomendaciones que el usuario ya tenga activas en su historial")
    void testAntiduplicateFilter_ExcludesActiveRecommendations() {
        when(userRecommendationRepository.findTipKeysByUserIdAndStatus(eq("user-10@alura.com"), eq(RecommendationStatus.ACTIVE)))
                .thenReturn(List.of(TipKey.HIGH_CONSUMPTION_PER_PERSON, TipKey.LED_UPGRADE_NEEDED));

        RecommendationRequest request = RecommendationRequest.builder()
                .userId("user-10@alura.com")
                .category(ConsumptionCategory.MODERADO)
                .consumoAnteriorPorPersona(new BigDecimal("180.0"))
                .proporcionIluminacionLed(new BigDecimal("0.20"))
                .factorAislamiento(new BigDecimal("0.8"))
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        List<TipKey> tipKeys = response.getRecommendations().stream()
                .map(item -> item.getTipKey())
                .toList();

        assertTrue(tipKeys.contains(TipKey.MEDIUM_CONSUMPTION_BASE));
        assertFalse(tipKeys.contains(TipKey.HIGH_CONSUMPTION_PER_PERSON));
        assertFalse(tipKeys.contains(TipKey.LED_UPGRADE_NEEDED));
    }
}