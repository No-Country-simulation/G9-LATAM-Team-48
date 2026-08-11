package com.alura.recommendation.service;

import com.alura.config.CalculationProperties;
import com.alura.common.enums.ConsumptionCategory;
import com.alura.common.constants.PropertyTypeConstants;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.persistence.RecommendationCatalogRepository;
import com.alura.recommendation.persistence.UserRecommendationRepository;
import com.alura.recommendation.rules.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RecommendationServiceImplTest {

    private RecommendationService recommendationService;
    private CalculationProperties calc;

    @BeforeEach
    void setUp() {
        calc = new CalculationProperties(
                2,
                new BigDecimal("150.0"),
                60.0,
                10.0,
                0.5,
                0.2,
                new BigDecimal("1.4"),
                new BigDecimal("1.0"),
                new BigDecimal("0.8"),
                5,
                10,
                5,
                new BigDecimal("0.25"),
                new BigDecimal("0.45"),
                new BigDecimal("0.75"));

        List<RecommendationRule> rules = List.of(
                new HighConsumptionRule(),
                new MediumConsumptionRule(),
                new LowConsumptionRule(),
                new PeakHourUsageRule(),
                new AirConditioningRule(),
                new StandbyPowerRule(),
                new HighConsumptionDurationRule(),
                new CommercialOptimizationRule(),
                new HouseEfficiencyRule(),
                new ApartmentEfficiencyRule(),
                new HighOccupantConsumptionRule(calc),
                new InsulationFromFormRule(calc),
                new LedUpgradeRule());

        RecommendationCatalogRepository catalogRepository = mock(RecommendationCatalogRepository.class);
        when(catalogRepository.findAll()).thenReturn(List.of());
        UserRecommendationRepository userRecommendationRepository = mock(UserRecommendationRepository.class);
        RecommendationCatalogMapper catalogMapper = new RecommendationCatalogMapper();

        recommendationService = new RecommendationServiceImpl(
                rules, catalogRepository, userRecommendationRepository, catalogMapper);
    }

    private static RecommendationRequest request(
            String userId, String category, String tipoInmueble, Integer equipos,
            Integer horasClima, Integer horasAlto, Boolean usoPico,
            Double pctLed, String aislamiento, Double antiguedad,
            Double consumoPorPersona, Double factorAislamiento, Double proporcionLed) {
        return new RecommendationRequest(
                userId, category, tipoInmueble, equipos, horasClima, horasAlto, usoPico,
                pctLed, aislamiento, antiguedad,
                consumoPorPersona, factorAislamiento, proporcionLed);
    }

    @Test
    @DisplayName("Debería retornar la clave 'ac' para perfiles de alto consumo genérico")
    void shouldGenerateHighConsumptionRecommendation() {
        RecommendationRequest request = request(
                "user-123", ConsumptionCategory.HIGH.getModelValue(),
                null, null, null, null, false,
                null, null, null, null, null, null);

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("ac"));
    }

    @Test
    @DisplayName("Debería retornar la clave 'shifts' para perfiles de consumo medio")
    void shouldGenerateMediumConsumptionRecommendation() {
        RecommendationRequest request = request(
                "user-456", ConsumptionCategory.MEDIUM.getModelValue(),
                null, null, null, null, false,
                null, null, null, null, null, null);

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("shifts"));
    }

    @Test
    @DisplayName("Debería combinar claves cuando aplican múltiples reglas")
    void shouldCombineKeysForMultipleRules() {
        RecommendationRequest request = request(
                "user-789", ConsumptionCategory.MEDIUM.getModelValue(), PropertyTypeConstants.HOUSE,
                20, 2, 2, true,
                null, null, null, null, null, null);

        RecommendationResponse response = recommendationService.generate(request);

        assertTrue(response.recommendations().contains("house"));
        assertTrue(response.recommendations().contains("peak"));
        assertTrue(response.recommendations().contains("standby"));
        assertTrue(response.recommendations().contains("shifts"));
    }

    @Test
    @DisplayName("Debería activar regla de consumo per cápita con métrica SHAP derivada")
    void shouldTriggerOccupancyRuleFromDerivedMetric() {
        RecommendationRequest request = request(
                "user-111", ConsumptionCategory.HIGH.getModelValue(),
                null, null, null, null, false,
                null, null, null, 180.0, null, null);

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("occupancy"));
    }

    @Test
    @DisplayName("Debería activar LED cuando la proporción calculada es baja")
    void shouldTriggerLedRuleFromCalculatedProportion() {
        RecommendationRequest request = request(
                "user-222", ConsumptionCategory.MEDIUM.getModelValue(),
                null, null, null, null, false,
                null, null, null, null, null, 0.20);

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("led"));
    }

    @Test
    @DisplayName("Debería retornar clave 'default' ante categoría desconocida")
    void shouldProvideDefaultFallbackForUnknownCategory() {
        RecommendationRequest request = request(
                "user-999", "DESCONOCIDA",
                null, null, null, null, null,
                null, null, null, null, null, null);

        RecommendationResponse response = recommendationService.generate(request);

        assertEquals(1, response.recommendations().size());
        assertTrue(response.recommendations().contains("default"));
    }
}
