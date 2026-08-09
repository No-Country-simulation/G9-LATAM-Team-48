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
    private RecommendationRepository recommendationRepository;
    private UserRecommendationRepository userRecommendationRepository;

    @BeforeEach
    void setUp() {
        recommendationRepository = Mockito.mock(RecommendationRepository.class);
        userRecommendationRepository = Mockito.mock(UserRecommendationRepository.class);

        // Configuramos múltiples reglas activas alineadas al catálogo V2 ampliado
        List<RecommendationRule> rules = List.of(
                new HighOccupantConsumptionRule(),
                new InsulationFromFormRule(),
                new LedUpgradeRule()
        );

        recommendationService = new RecommendationServiceImpl(
                rules,
                recommendationRepository,
                userRecommendationRepository
        );

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
    @DisplayName("Debe filtrar y no retornar recomendaciones que el usuario ya tenga activas en su historial (Antiduplicados)")
    void testAntiduplicateFilter_ExcludesActiveRecommendations() {
        // Simulamos que el usuario 10 ya tiene activa la recomendación HIGH_CONSUMPTION_PER_PERSON y LED_UPGRADE_NEEDED
        when(userRecommendationRepository.findTipKeysByUserIdAndStatus(eq(10L), eq(RecommendationStatus.ACTIVE)))
                .thenReturn(List.of(TipKey.HIGH_CONSUMPTION_PER_PERSON, TipKey.LED_UPGRADE_NEEDED));

        RecommendationRequest request = RecommendationRequest.builder()
                .userId(10L)
                .category(ConsumptionCategory.MODERADO)
                .consumoAnteriorPorPersona(new BigDecimal("180.0")) // Dispara HIGH_CONSUMPTION_PER_PERSON
                .proporcionIluminacionLed(new BigDecimal("0.20"))   // Dispara LED_UPGRADE_NEEDED
                .factorAislamiento(new BigDecimal("0.8"))           // Bueno, no dispara insulation
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        List<TipKey> tipKeys = response.getRecommendations().stream()
                .map(item -> item.getTipKey())
                .toList();

        // Debe contener la base (MEDIUM_CONSUMPTION_BASE), pero NO las que ya están activas en el historial
        assertTrue(tipKeys.contains(TipKey.MEDIUM_CONSUMPTION_BASE));
        assertFalse(tipKeys.contains(TipKey.HIGH_CONSUMPTION_PER_PERSON), 
                "El filtro antiduplicados debe omitir HIGH_CONSUMPTION_PER_PERSON porque ya está activa");
        assertFalse(tipKeys.contains(TipKey.LED_UPGRADE_NEEDED), 
                "El filtro antiduplicados debe omitir LED_UPGRADE_NEEDED porque ya está activa");
    }

    @Test
    @DisplayName("Debe persistir y retornar nuevas recomendaciones si el usuario no las tenía activas en el catálogo ampliado")
    void testNewRecommendations_AreIncludedAndSaved() {
        // El usuario 20 no tiene ninguna recomendación activa
        when(userRecommendationRepository.findTipKeysByUserIdAndStatus(eq(20L), eq(RecommendationStatus.ACTIVE)))
                .thenReturn(List.of());

        RecommendationRequest request = RecommendationRequest.builder()
                .userId(20L)
                .category(ConsumptionCategory.INEFICIENTE)
                .consumoAnteriorPorPersona(new BigDecimal("220.0")) // Dispara HIGH_CONSUMPTION_PER_PERSON
                .factorAislamiento(new BigDecimal("1.4"))           // Dispara INSULATION_DEFICIENT
                .proporcionIluminacionLed(new BigDecimal("0.10"))   // Dispara LED_UPGRADE_NEEDED
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        List<TipKey> tipKeys = response.getRecommendations().stream()
                .map(item -> item.getTipKey())
                .toList();

        assertTrue(tipKeys.contains(TipKey.HIGH_CONSUMPTION_BASE));
        assertTrue(tipKeys.contains(TipKey.HIGH_CONSUMPTION_PER_PERSON));
        assertTrue(tipKeys.contains(TipKey.INSULATION_DEFICIENT));
        assertTrue(tipKeys.contains(TipKey.LED_UPGRADE_NEEDED));
    }
}