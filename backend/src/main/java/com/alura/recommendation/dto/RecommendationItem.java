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
        String categoryKey,
        String priorityKey,
        String ahorro,
        String title,
        String description
) {
    /** Compatibilidad con catálogo demo en memoria (i18n por id). */
    public RecommendationItem(int id, String categoryKey, String priorityKey, String ahorro) {
        this(id, categoryKey, priorityKey, ahorro, null, null);
    }
}
