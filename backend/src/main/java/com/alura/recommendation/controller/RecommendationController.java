package com.alura.recommendation.controller;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API de recomendaciones (modulo aparte del Analisis IA).
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Recomendaciones", description = "Sugerencias de ahorro energetico")
public class RecommendationController {

    private final RecommendationServiceImpl recommendationService;

    public RecommendationController(RecommendationServiceImpl recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recomendaciones")
    @Operation(summary = "Listar recomendaciones (contrato frontend)")
    public ResponseEntity<List<RecommendationItem>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String nivel,
            @RequestParam(required = false) String domain,
            Authentication authentication) {
        String userEmail = authentication != null && authentication.isAuthenticated()
                ? authentication.getName()
                : null;
        return ResponseEntity.ok(recommendationService.listForFrontend(category, nivel, domain, userEmail));
    }

    @PostMapping("/v1/recommendations")
    @Operation(summary = "Generar recomendaciones por categoria de prediccion")
    public ResponseEntity<RecommendationResponse> generate(@RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.generate(request));
    }
}
