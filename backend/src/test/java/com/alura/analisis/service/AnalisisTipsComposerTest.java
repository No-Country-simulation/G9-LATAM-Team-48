package com.alura.analisis.service;

import com.alura.config.CalculationProperties;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalisisTipsComposerTest {

    @Mock
    RecommendationService recommendationService;

    AnalisisFeatureCalculator featureCalculator;
    AnalisisTipsComposer composer;

    @BeforeEach
    void setUp() {
        CalculationProperties calc = new CalculationProperties(
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
        featureCalculator = new AnalisisFeatureCalculator(calc);
        composer = new AnalisisTipsComposer(recommendationService, featureCalculator);
    }

    @Test
    @DisplayName("Enriquece el request con métricas SHAP derivadas antes de evaluar reglas")
    void compose_passesDerivedMetricsToRecommendationService() {
        Map<String, Object> features = Map.of(
                "consumo_kwh_mensual", 360,
                "cantidad_personas", 2,
                "area_m2", 60,
                "horas_uso_aa_dia", 8,
                "cantidad_equipos_total", 12);

        when(recommendationService.generate(any())).thenReturn(
                new RecommendationResponse("user@test.com", List.of("occupancy")));

        PredictionResponse prediction = new PredictionResponse(
                null, "ALTO", "inefficient", 0.9, 15, List.of(), 380.0);

        List<String> tips = composer.compose(prediction, features, "user@test.com");

        ArgumentCaptor<RecommendationRequest> captor = ArgumentCaptor.forClass(RecommendationRequest.class);
        verify(recommendationService).generate(captor.capture());
        RecommendationRequest captured = captor.getValue();
        assertNotNull(captured.consumoPorPersona());
        assertTrue(captured.consumoPorPersona() >= 180.0);
        assertNotNull(captured.factorAislamientoCalculado());
        assertNotNull(captured.proporcionLedCalculada());
        assertTrue(tips.contains("occupancy"));
    }
}
