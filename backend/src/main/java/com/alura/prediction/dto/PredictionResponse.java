package com.alura.prediction.dto;

/**
 * Contrato de salida del modulo de prediccion.
 *
 * <p>Representa el resultado de la clasificacion devuelta por el modelo de
 * Machine Learning.</p>
 *
 * @param userId     identificador del usuario evaluado
 * @param category   categoria/clase de consumo asignada por el modelo
 * @param confidence nivel de confianza de la prediccion (0.0 - 1.0)
 */
public record PredictionResponse(
        String userId,
        String category,
        double confidence
) {
}
