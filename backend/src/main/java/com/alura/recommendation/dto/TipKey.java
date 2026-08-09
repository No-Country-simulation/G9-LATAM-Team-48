package com.alura.recommendation.dto;

/**
 * Catálogo V2 de identificadores de recomendaciones soportados por el sistema.
 * Alineado estrictamente con el análisis SHAP del modelo LightGBM.
 */
public enum TipKey {
    // Recomendaciones Base por Categoría (Nivel 1)
    LOW_CONSUMPTION_BASE,
    MEDIUM_CONSUMPTION_BASE,
    HIGH_CONSUMPTION_BASE,

    // Alertas y Oportunidades Específicas basadas en SHAP (Nivel 2)
    HIGH_CONSUMPTION_PER_PERSON,
    INSULATION_DEFICIENT,
    LED_UPGRADE_NEEDED,
    AIR_CONDITIONING_OPTIMIZATION,
    HIGH_EQUIPMENT_DENSITY,
    STANDBY_POWER_DRAIN,
    COMMERCIAL_OFF_HOURS_USE,
    PEAK_HOUR_SHIFT
}