package com.alura.common.enums;

/**
 * Enum que mapea las categorías del modelo predictivo (Python)
 * con las claves visuales esperadas por el frontend.
 */
public enum ConsumptionCategory {
    HIGH("ALTO", "inefficient"),
    MEDIUM("MODERADO", "moderate"),
    LOW("BAJO", "efficient");

    private final String modelValue;
    private final String frontendKey;

    ConsumptionCategory(String modelValue, String frontendKey) {
        this.modelValue = modelValue;
        this.frontendKey = frontendKey;
    }

    public String getModelValue() {
        return modelValue;
    }

    public String getFrontendKey() {
        return frontendKey;
    }

    /**
     * Devuelve la clave del frontend asociada al valor del modelo.
     * Si no coincide, retorna "unknown" como fallback.
     */
    public static String getFrontendKeyFor(String modelValue) {
        if (modelValue == null) return "unknown";

        for (ConsumptionCategory category : values()) {
            if (category.modelValue.equalsIgnoreCase(modelValue)) {
                return category.frontendKey;
            }
        }
        return "unknown";
    }
}