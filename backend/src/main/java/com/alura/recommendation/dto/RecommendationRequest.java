package com.alura.recommendation.dto;

/**
 * Contrato de entrada del módulo de recomendaciones (Opción C).
 *
 * <p>Incluye la categoría determinada por el modelo (vía prediction)
 * más las variables específicas del consumo y el tipo de inmueble,
 * para que las reglas granulares puedan evaluarse correctamente.</p>
 */
public record RecommendationRequest(
        String userId,
        String category,
        String tipoInmueble,
        Integer cantidadEquipos,
        Integer horasClimatizacion,
        Integer horasAltoConsumo,
        Boolean usoHorarioPico
) {
}