package com.alura.recommendation.dto;

/**
 * Contrato de entrada del modulo de recomendaciones.
 *
 * @param userId   identificador del usuario
 * @param category categoria de consumo asignada por el modulo de prediccion
 */
public record RecommendationRequest(
        String userId,
        String category
) {
}
