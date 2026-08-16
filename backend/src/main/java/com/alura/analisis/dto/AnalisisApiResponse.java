package com.alura.analisis.dto;

import com.alura.prediction.dto.PredictionResponse;

import java.util.List;

/**
 * Respuesta de {@code POST /api/analisis}: resultado ML + estado de email.
 */
public record AnalisisApiResponse(
        String userId,
        String category,
        String nivelKey,
        double confidence,
        int ahorro,
        List<String> tipKeys,
        double benchmark,
        String emailStatus,
        Long consultaId
) {
    public static AnalisisApiResponse from(
            PredictionResponse result, String emailStatus, Long consultaId) {
        return new AnalisisApiResponse(
                result.userId(),
                result.category(),
                result.nivelKey(),
                result.confidence(),
                result.ahorro(),
                result.tipKeys(),
                result.benchmark(),
                emailStatus,
                consultaId);
    }
}
