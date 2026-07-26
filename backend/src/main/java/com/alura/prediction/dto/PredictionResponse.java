package com.alura.prediction.dto;

import java.util.List;

/**
 * Resultado de clasificacion del servicio ML (FastAPI).
 */
public record PredictionResponse(
        String userId,
        String category,
        String nivelKey,
        double confidence,
        int ahorro,
        List<String> tipKeys,
        double benchmark
) {
}