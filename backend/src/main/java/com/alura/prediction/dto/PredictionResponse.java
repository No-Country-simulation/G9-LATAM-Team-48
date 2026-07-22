package com.alura.prediction.dto;

/**
 * Resultado de una predicción de consumo energético.
 *
 * @param categoria categoría de consumo calculada por el servicio
 * @param confianza nivel de confianza de la predicción, entre 0.0 y 1.0
 */
public record PredictionResponse(
        String categoria,
        double confianza
) {
}