package com.alura.common.constants;

import java.math.BigDecimal;

/**
 * Constantes y umbrales heurísticos globales para el cálculo de variables SHAP y métricas derivadas.
 * Sujetos a validación y ajuste con el equipo de Data Science.
 */
public final class CalculationConstants {

    private CalculationConstants() {
        // Ocultamos constructor por defecto para prevenir instanciación
    }

    // --- Consumo Per Cápita ---
    public static final int DEFAULT_OCCUPANTS_COUNT = 2;
    public static final BigDecimal DEFAULT_CONSUMPTION_PER_PERSON = new BigDecimal("150.0");

    // --- Aislamiento Térmico ---
    public static final double DEFAULT_AREA_M2 = 60.0;
    public static final double MIN_AREA_THRESHOLD = 10.0;
    
    // Ratios de puente térmico / climatización (Valores revisables por Data)
    public static final double POOR_INSULATION_RATIO_THRESHOLD = 0.5;
    public static final double FAIR_INSULATION_RATIO_THRESHOLD = 0.2;

    public static final BigDecimal INSULATION_FACTOR_POOR = new BigDecimal("1.4");
    public static final BigDecimal INSULATION_FACTOR_FAIR = new BigDecimal("1.0");
    public static final BigDecimal INSULATION_FACTOR_GOOD = new BigDecimal("0.8");

    // --- Iluminación LED ---
    public static final int DEFAULT_EQUIPMENT_COUNT = 5;
    public static final int HIGH_EQUIPMENT_THRESHOLD = 10;
    public static final int MEDIUM_EQUIPMENT_THRESHOLD = 5;

    public static final BigDecimal LED_PROPORTION_LOW = new BigDecimal("0.25");
    public static final BigDecimal LED_PROPORTION_MEDIUM = new BigDecimal("0.45");
    public static final BigDecimal LED_PROPORTION_HIGH = new BigDecimal("0.75");
}