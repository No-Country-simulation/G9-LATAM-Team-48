package com.alura.config;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;

/**
 * Umbrales heurísticos para métricas derivadas / SHAP (ajustables por Data Science).
 *
 * <p>Defaults en {@code application.yml}; override en prod vía env {@code APP_CALCULATION_*}
 * (ver {@code backend/.env.example}). No editar valores en código Java.
 */
@Validated
@ConfigurationProperties(prefix = "app.calculation")
public record CalculationProperties(

        @Min(1) int defaultOccupantsCount,

        @DecimalMin("0.0") BigDecimal defaultConsumptionPerPerson,

        @Positive double defaultAreaM2,

        @Positive double minAreaThreshold,

        @DecimalMin("0.0") double poorInsulationRatioThreshold,

        @DecimalMin("0.0") double fairInsulationRatioThreshold,

        @DecimalMin("0.0") BigDecimal insulationFactorPoor,

        @DecimalMin("0.0") BigDecimal insulationFactorFair,

        @DecimalMin("0.0") BigDecimal insulationFactorGood,

        @Min(0) int defaultEquipmentCount,

        @Min(1) int highEquipmentThreshold,

        @Min(1) int mediumEquipmentThreshold,

        @DecimalMin("0.0") BigDecimal ledProportionLow,

        @DecimalMin("0.0") BigDecimal ledProportionMedium,

        @DecimalMin("0.0") BigDecimal ledProportionHigh) {

    /** Factor de aislamiento según ratio (pobre / regular / bueno). */
    public BigDecimal insulationFactorForRatio(double ratio) {
        if (ratio >= poorInsulationRatioThreshold) {
            return insulationFactorPoor;
        }
        if (ratio >= fairInsulationRatioThreshold) {
            return insulationFactorFair;
        }
        return insulationFactorGood;
    }

    /** Proporción LED según cantidad de equipos. */
    public BigDecimal ledProportionForEquipmentCount(int equipmentCount) {
        if (equipmentCount >= highEquipmentThreshold) {
            return ledProportionHigh;
        }
        if (equipmentCount >= mediumEquipmentThreshold) {
            return ledProportionMedium;
        }
        return ledProportionLow;
    }
}
