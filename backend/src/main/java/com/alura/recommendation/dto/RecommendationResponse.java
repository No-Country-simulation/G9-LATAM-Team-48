package com.alura.recommendation.dto;

import java.util.List;

/**
 * Contrato de salida del modulo de recomendaciones.
 *
 * @param userId          identificador del usuario
 * @param recommendations lista de recomendaciones generadas por el motor de reglas
 */
public record RecommendationResponse(
        String userId,
        List<String> recommendations
) {
}
