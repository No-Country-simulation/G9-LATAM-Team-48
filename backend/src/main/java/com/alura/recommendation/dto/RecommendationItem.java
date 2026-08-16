package com.alura.recommendation.dto;

/**
 * Item de recomendacion alineado al frontend EnergyAI.
 *
 * @param id          identificador
 * @param categoryKey clave i18n (lighting, habits, climate, equipment, tech)
 * @param priorityKey prioridad (high, medium, low)
 * @param ahorro      ahorro estimado legible (ej. "12%")
 */
public record RecommendationItem(
        int id,
        String tipKey,
        String categoryKey,
        String priorityKey,
        String ahorro,
        String title,
        String description
) {
}
