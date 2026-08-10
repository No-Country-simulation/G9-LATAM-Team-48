package com.alura.recommendation.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RecommendationServiceImplTest {

    private RecommendationServiceImpl recommendationService;
    private RecommendationHistoryService historyService;

    @BeforeEach
    void setUp() {
        historyService = Mockito.mock(RecommendationHistoryService.class);

        List<RecommendationRule> rules = List.of(
                new HighOccupantConsumptionRule(),
                new InsulationFromFormRule(),
                new LedUpgradeRule()
        );

        recommendationService = new RecommendationServiceImpl(rules, historyService);

        // Mockeamos el Historial para que devuelva entidades simuladas en base a las keys
        when(historyService.filterAndPersistNovedades(any(), any())).thenAnswer(invocation -> {
            Set<TipKey> keys = invocation.getArgument(1);
            return keys.stream().map(key -> RecommendationEntity.builder().tipKey(key).type("INFO").build()).toList();
        });
    }

    @Test
    @DisplayName("Debe retornar únicamente recomendación base para categoría EFICIENTE")
    void testEficienteCategory_OnlyBaseTip() {
        RecommendationRequest request = RecommendationRequest.builder()
                .userId("1") // Actualizado a String para coherencia con el motor V2
                .category(ConsumptionCategory.EFICIENTE)
                .consumoAnteriorPorPersona(new BigDecimal("200.0"))
                .factorAislamiento(new BigDecimal("1.3"))
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        assertEquals(ConsumptionCategory.EFICIENTE, response.getCategory());
        assertEquals("efficient", response.getCategoryFrontendKey());
        assertEquals(1, response.getRecommendations().size());
        assertEquals(TipKey.LOW_CONSUMPTION_BASE, response.getRecommendations().get(0).getTipKey());
    }

    @Test
    @DisplayName("Debe evaluar y disparar reglas específicas para categoría MODERADO")
    void testModeradoCategory_TriggersSpecificRules() {
        RecommendationRequest request = RecommendationRequest.builder()
                .userId("2") // Actualizado a String para coherencia con el motor V2
                .category(ConsumptionCategory.MODERADO)
                .consumoAnteriorPorPersona(new BigDecimal("180.0"))
                .proporcionIluminacionLed(new BigDecimal("0.20"))
                .factorAislamiento(new BigDecimal("0.7"))
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);

        assertNotNull(response);
        assertEquals(3, response.getRecommendations().size());

        List<TipKey> tipKeys = response.getRecommendations().stream()
                .map((RecommendationItem item) -> item.getTipKey()) // Tipado explícito para evitar warnings de null safety
                .toList();

        assertTrue(tipKeys.contains(TipKey.MEDIUM_CONSUMPTION_BASE));
        assertTrue(tipKeys.contains(TipKey.HIGH_CONSUMPTION_PER_PERSON));
        assertTrue(tipKeys.contains(TipKey.LED_UPGRADE_NEEDED));
        assertFalse(tipKeys.contains(TipKey.INSULATION_DEFICIENT));
    }
}