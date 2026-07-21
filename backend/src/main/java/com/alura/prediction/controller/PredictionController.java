package com.alura.prediction.controller;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.prediction.service.PredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * API de prediccion (contrato generico hacia FastAPI).
 *
 * <p>Para el formulario del frontend preferir {@code POST /api/analisis}.</p>
 */
@RestController
@RequestMapping("/api/v1/predictions")
@Tag(name = "Predictions", description = "Proxy generico al modelo ML")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping
    @Operation(summary = "Clasificar con features anidadas")
    public ResponseEntity<PredictionResponse> classify(@Valid @RequestBody PredictionRequest request) {
        return ResponseEntity.ok(predictionService.classify(request));
    }

    @PostMapping("/analyze")
    @Operation(summary = "Clasificar con payload plano (alias)")
    public ResponseEntity<PredictionResponse> analyze(@RequestBody Map<String, Object> features) {
        return ResponseEntity.ok(predictionService.analyze(features));
    }
}
