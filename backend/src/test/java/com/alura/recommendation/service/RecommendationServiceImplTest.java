package com.alura.recommendation.service;

import com.alura.common.constants.CategoryConstants;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.HighConsumptionRule;
import com.alura.recommendation.rules.LowConsumptionRule;
import com.alura.recommendation.rules.MediumConsumptionRule;
import com.alura.recommendation.rules.PeakHourUsageRule;
import com.alura.recommendation.rules.RecommendationRule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el servicio de recomendaciones y su motor de reglas.
 *
 * <p>Verifica que el orquestador evalúe correctamente el contrato de entrada
 * (Opción C) y retorne las claves cortas (tipKeys) adecuadas para que el
 * frontend resuelva la traducción final.</p>
 *
 * <p>Diseñado bajo un enfoque de pruebas unitarias puras y rápidas, garantizando
 * tiempos de ejecución en el orden de los milisegundos.</p>
 *
 * @author miyo
 * @version 2.0
 */
class RecommendationServiceImplTest {

    private RecommendationService recommendationService;

    /**
     * Configuración previa a cada test. Inicializa el motor con todas las reglas activas.
     */
    @BeforeEach
    void setUp() {
        List<RecommendationRule> rules = List.of(
                new HighConsumptionRule(),
                new MediumConsumptionRule(),
                new LowConsumptionRule(),
                new PeakHourUsageRule() // Agregamos la nueva regla granular
        );

        recommendationService = new RecommendationServiceImpl(rules);
    }

    @Test
    @DisplayName("Debería retornar la clave 'ac' para perfiles de alto consumo")
    void shouldGenerateHighConsumptionRecommendation() {
        // Given
        RecommendationRequest request = new RecommendationRequest(
                "user-123", CategoryConstants.HIGH, null, null, null, false
        );

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertNotNull(response, "La respuesta no debería ser nula");
        assertEquals("user-123", response.userId(), "El ID de usuario debe coincidir");
        assertTrue(response.recommendations().contains("ac"), "Debería sugerir la clave 'ac'");
    }

    @Test
    @DisplayName("Debería retornar la clave 'shifts' para perfiles de consumo medio")
    void shouldGenerateMediumConsumptionRecommendation() {
        // Given
        RecommendationRequest request = new RecommendationRequest(
                "user-456", CategoryConstants.MEDIUM, null, null, null, false
        );

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertTrue(response.recommendations().contains("shifts"), "Debería sugerir la clave 'shifts'");
    }

    @Test
    @DisplayName("Debería combinar claves cuando aplican múltiples reglas simultáneas")
    void shouldCombineKeysForMultipleRules() {
        // Given: Un usuario con consumo BAJO, pero que SÍ usa horario pico
        RecommendationRequest request = new RecommendationRequest(
                "user-789", CategoryConstants.LOW, "CASA_UNIFAMILIAR", 5, 2, true
        );

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertEquals(2, response.recommendations().size(), "Deberían aplicar exactamente dos reglas");
        assertTrue(response.recommendations().contains("default"), "Debería incluir la regla de consumo bajo");
        assertTrue(response.recommendations().contains("peak"), "Debería incluir la regla de horario pico");
    }

    @Test
    @DisplayName("Debería retornar clave 'default' como contingencia ante categoría desconocida")
    void shouldProvideDefaultFallbackForUnknownCategory() {
        // Given
        RecommendationRequest request = new RecommendationRequest(
                "user-999", "DESCONOCIDA", null, null, null, null
        );

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertEquals(1, response.recommendations().size(), "Debería contener solo la contingencia");
        assertTrue(response.recommendations().contains("default"), "Debería retornar la clave por defecto");
    }
}