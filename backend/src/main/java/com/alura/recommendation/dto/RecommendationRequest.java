package com.alura.recommendation.dto;

/**
 * Contrato de entrada del módulo de recomendaciones (Opción C).
 *
 * <p>Incluye la categoría determinada por el modelo (vía prediction)
 * más las variables específicas del consumo, para que las reglas puedan decidir
 * con más granularidad que solo la categoría general.</p>
 */
public record RecommendationRequest(
        String userId,
        String category,
        String tipoInmueble,
        Integer cantidadEquipos,
        Integer horasAltoConsumo,
        Boolean usoHorarioPico
) {
}