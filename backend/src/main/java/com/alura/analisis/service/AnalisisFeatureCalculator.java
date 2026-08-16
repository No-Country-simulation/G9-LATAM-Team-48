package com.alura.analisis.service;

import com.alura.config.CalculationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Métricas derivadas / variables SHAP a partir del mapa de features del análisis.
 * Umbrales en {@link CalculationProperties} (tunable vía {@code APP_CALCULATION_*}).
 */
@Component
public class AnalisisFeatureCalculator {

    private final CalculationProperties calc;

    public AnalisisFeatureCalculator(CalculationProperties calc) {
        this.calc = calc;
    }

    public BigDecimal calculateConsumptionPerPerson(Map<String, Object> features) {
        if (features == null || !features.containsKey("consumo_kwh_mensual")) {
            return calc.defaultConsumptionPerPerson();
        }
        try {
            double consumo = parseDouble(features.get("consumo_kwh_mensual"));
            int personas = features.containsKey("cantidad_personas")
                    ? parseInt(features.get("cantidad_personas"), calc.defaultOccupantsCount())
                    : calc.defaultOccupantsCount();
            if (personas <= 0) {
                personas = calc.defaultOccupantsCount();
            }
            return BigDecimal.valueOf(consumo)
                    .divide(BigDecimal.valueOf(personas), 2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return calc.defaultConsumptionPerPerson();
        }
    }

    public BigDecimal calculateInsulationFactor(Map<String, Object> features) {
        if (features == null) {
            return calc.insulationFactorFair();
        }
        try {
            double area = features.containsKey("area_m2")
                    ? parseDouble(features.get("area_m2"))
                    : calc.defaultAreaM2();
            double horasClima = doubleFromFeatures(features, 0.0,
                    "horas_uso_aa_dia", "horasClimatizacion", "horas_climatizacion");
            double ratioClimaArea = horasClima / Math.max(area, calc.minAreaThreshold());
            return calc.insulationFactorForRatio(ratioClimaArea);
        } catch (Exception e) {
            return calc.insulationFactorFair();
        }
    }

    public BigDecimal calculateLedProportion(Map<String, Object> features) {
        if (features == null) {
            return calc.ledProportionMedium();
        }
        try {
            int equipos = intFromFeatures(features, calc.defaultEquipmentCount(),
                    "cantidad_equipos_total", "cantidadEquipos", "cantidad_equipos");
            if (equipos > calc.highEquipmentThreshold()) {
                return calc.ledProportionLow();
            }
            if (equipos > calc.mediumEquipmentThreshold()) {
                return calc.ledProportionMedium();
            }
            return calc.ledProportionHigh();
        } catch (Exception e) {
            return calc.ledProportionMedium();
        }
    }

    private static double parseDouble(Object val) {
        if (val == null) {
            return 0.0;
        }
        if (val instanceof Number number) {
            return number.doubleValue();
        }
        return Double.parseDouble(val.toString().trim());
    }

    private static int intFromFeatures(Map<String, Object> features, int defaultVal, String... keys) {
        for (String key : keys) {
            if (features.containsKey(key) && features.get(key) != null) {
                return parseInt(features.get(key), defaultVal);
            }
        }
        return defaultVal;
    }

    private static double doubleFromFeatures(Map<String, Object> features, double defaultVal, String... keys) {
        for (String key : keys) {
            if (features.containsKey(key) && features.get(key) != null) {
                return parseDouble(features.get(key));
            }
        }
        return defaultVal;
    }

    private static int parseInt(Object val, int defaultVal) {
        if (val == null) {
            return defaultVal;
        }
        if (val instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(val.toString().trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
