package com.alura.recommendation.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.common.constants.PropertyTypeConstants;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el servicio de recomendaciones y su motor de reglas.
 *
 * <p>Verifica que el orquestador evalúe correctamente el contrato de entrada
 * enriquecido (7 parámetros) y retorne las claves cortas (tipKeys) adecuadas.</p>
 *
 * @version 3.0
 */
class RecommendationServiceImplTest {

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        // Registramos TODAS las reglas de negocio y de inmueble creadas
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
                new ApartmentEfficiencyRule()
        );

        recommendationService = new RecommendationServiceImpl(rules);
    }

    @Test
    @DisplayName("Debería retornar la clave 'ac' para perfiles de alto consumo genérico")
    void shouldGenerateHighConsumptionRecommendation() {
        // Pasamos los 7 parámetros: userId, category, tipoInmueble, cantidadEquipos, horasClima, horasAltoConsumo, usoPico
        RecommendationRequest request = new RecommendationRequest(
                "user-123", ConsumptionCategory.HIGH.getModelValue(), null, null, null, null, false
        );

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("ac"), "Debería sugerir la clave 'ac'");
    }

    @Test
    @DisplayName("Debería retornar la clave 'shifts' para perfiles de consumo medio")
    void shouldGenerateMediumConsumptionRecommendation() {
        RecommendationRequest request = new RecommendationRequest(
                "user-456", ConsumptionCategory.MEDIUM.getModelValue(), null, null, null, null, false
        );

        RecommendationResponse response = recommendationService.generate(request);
        assertTrue(response.recommendations().contains("shifts"), "Debería sugerir la clave 'shifts'");
    }

    @Test
    @DisplayName("Debería combinar claves cuando aplican múltiples reglas (Casa + Horario Pico + Standby)")
    void shouldCombineKeysForMultipleRules() {
        // Given: Casa, 20 equipos (activa Standby), usa horario pico (activa Peak) y consumo Medio (activa Shifts)
        RecommendationRequest request = new RecommendationRequest(
                "user-789", ConsumptionCategory.MEDIUM.getModelValue(), PropertyTypeConstants.HOUSE, 20, 2, 2, true
        );

        RecommendationResponse response = recommendationService.generate(request);

        // Validamos que todas las reglas aplicables devuelvan su clave
        assertTrue(response.recommendations().contains("house"));
        assertTrue(response.recommendations().contains("peak"));
        assertTrue(response.recommendations().contains("standby"));
        assertTrue(response.recommendations().contains("shifts"));
    }

    @Test
    @DisplayName("Debería activar regla específica de Comercio y Aire Acondicionado")
    void shouldTriggerCommercialAndAcRules() {
        // Given: Comercio con 10 horas de climatización
        RecommendationRequest request = new RecommendationRequest(
                "user-333", ConsumptionCategory.HIGH.getModelValue(), PropertyTypeConstants.COMMERCIAL, 5, 10, 5, false
        );

        RecommendationResponse response = recommendationService.generate(request);

        assertTrue(response.recommendations().contains("commercial"));
        assertTrue(response.recommendations().contains("ac"));
    }

    @Test
    @DisplayName("Debería retornar clave 'default' como contingencia ante categoría desconocida y sin variables")
    void shouldProvideDefaultFallbackForUnknownCategory() {
        RecommendationRequest request = new RecommendationRequest(
                "user-999", "DESCONOCIDA", null, null, null, null, null
        );

        RecommendationResponse response = recommendationService.generate(request);

        assertEquals(1, response.recommendations().size());
        assertTrue(response.recommendations().contains("default"));
    }
}