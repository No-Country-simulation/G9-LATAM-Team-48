package com.alura.recommendation.controller;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recommendations")
@Tag(name = "Recomendaciones", description = "Motor de Recomendaciones Energéticas V2")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generar recomendaciones para un usuario y análisis", description = "Evalúa reglas SHAP, valida contra el historial activo para evitar duplicados y persiste las novedades.")
    public ResponseEntity<RecommendationResponse> generateRecommendations(@RequestBody RecommendationRequest request) {
        RecommendationResponse response = recommendationService.generateRecommendations(request);
        return ResponseEntity.ok(response);
    }
}