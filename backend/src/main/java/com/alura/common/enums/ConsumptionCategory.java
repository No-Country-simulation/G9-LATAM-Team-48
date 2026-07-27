package com.alura.common.enums;

/**
 * Enum que centraliza el mapeo entre los contratos del modelo ML (Python)
 * y las claves visuales del frontend.
 */
public enum ConsumptionCategory {

    // Definimos constantes autoexplicativas para los valores que emite el modelo
    HIGH(ModelValues.HIGH_CONSUMPTION, "inefficient"),
    MEDIUM(ModelValues.MODERADO_CONSUMPTION, "moderate"),
    LOW(ModelValues.LOW_CONSUMPTION, "efficient");

    /**
     * Contratos esperados desde el servicio de Machine Learning (Python).
     * Si el modelo cambia su salida, solo se actualiza aquí.
     */
    public static final class ModelValues {
        private ModelValues() {}
        public static final String HIGH_CONSUMPTION = "ALTO";
        public static final String MODERADO_CONSUMPTION = "MODERADO";
        public static final String LOW_CONSUMPTION = "BAJO";
    }

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