package com.alura.recommendation.controller;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API de recomendaciones (módulo independiente del motor de predicción).
 *
 * <p>Permite evaluar el motor de reglas de forma aislada.</p>
 */
@RestController
@RequestMapping("/api/v1/recommendations")
@Tag(name = "Recomendaciones", description = "Sugerencias de ahorro energético")
public class RecommendationController {

    // 1. Inyectamos la interfaz, NO la implementación (SOLID)
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // 2. Mantenemos solo el endpoint que genera las TipKeys dinámicas
    @PostMapping
    @Operation(summary = "Generar recomendaciones evaluando el motor de reglas")
    public ResponseEntity<RecommendationResponse> generate(@RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.generate(request));
    }
}