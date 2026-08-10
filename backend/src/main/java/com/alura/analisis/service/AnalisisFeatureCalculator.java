package com.alura.analisis.service;

import com.alura.common.constants.CalculationConstants;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Componente responsable de calcular las variables derivadas y métricas SHAP
 * a partir del mapa de features recibido de la predicción o formulario.
 */
@Component
public class AnalisisFeatureCalculator {

    public BigDecimal calculateConsumptionPerPerson(Map<String, Object> features) {
        if (features == null || !features.containsKey("consumo_kwh_mensual")) {
            return CalculationConstants.DEFAULT_CONSUMPTION_PER_PERSON;
        }
        try {
            double consumo = parseDouble(features.get("consumo_kwh_mensual"));
            int personas = features.containsKey("cantidad_personas") ? parseInt(features.get("cantidad_personas"), CalculationConstants.DEFAULT_OCCUPANTS_COUNT) : CalculationConstants.DEFAULT_OCCUPANTS_COUNT;
            if (personas <= 0) personas = CalculationConstants.DEFAULT_OCCUPANTS_COUNT;
            
            return BigDecimal.valueOf(consumo).divide(BigDecimal.valueOf(personas), 2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return CalculationConstants.DEFAULT_CONSUMPTION_PER_PERSON;
        }
    }

    public BigDecimal calculateInsulationFactor(Map<String, Object> features) {
        if (features == null) {
            return CalculationConstants.INSULATION_FACTOR_FAIR;
        }
        try {
            double area = features.containsKey("area_m2") ? parseDouble(features.get("area_m2")) : CalculationConstants.DEFAULT_AREA_M2;
            double horasClima = features.containsKey("horas_climatizacion") ? parseDouble(features.get("horas_climatizacion")) : 0.0;
            
            double ratioClimaArea = horasClima / Math.max(area, CalculationConstants.MIN_AREA_THRESHOLD);
            
            if (ratioClimaArea > CalculationConstants.POOR_INSULATION_RATIO_THRESHOLD) {
                return CalculationConstants.INSULATION_FACTOR_POOR;
            } else if (ratioClimaArea > CalculationConstants.FAIR_INSULATION_RATIO_THRESHOLD) {
                return CalculationConstants.INSULATION_FACTOR_FAIR;
            } else {
                return CalculationConstants.INSULATION_FACTOR_GOOD;
            }
        } catch (Exception e) {
            return CalculationConstants.INSULATION_FACTOR_FAIR;
        }
    }

    public BigDecimal calculateLedProportion(Map<String, Object> features) {
        if (features == null) {
            return CalculationConstants.LED_PROPORTION_MEDIUM;
        }
        try {
            int equipos = features.containsKey("cantidad_equipos") ? parseInt(features.get("cantidad_equipos"), CalculationConstants.DEFAULT_EQUIPMENT_COUNT) : CalculationConstants.DEFAULT_EQUIPMENT_COUNT;
            
            if (equipos > CalculationConstants.HIGH_EQUIPMENT_THRESHOLD) {
                return CalculationConstants.LED_PROPORTION_LOW;
            } else if (equipos > CalculationConstants.MEDIUM_EQUIPMENT_THRESHOLD) {
                return CalculationConstants.LED_PROPORTION_MEDIUM;
            } else {
                return CalculationConstants.LED_PROPORTION_HIGH;
            }
        } catch (Exception e) {
            return CalculationConstants.LED_PROPORTION_MEDIUM;
        }
    }

    private double parseDouble(Object val) {
        if (val == null) return 0.0;
        if (val instanceof Number) return ((Number) val).doubleValue();
        return Double.parseDouble(val.toString().trim());
    }

    private int parseInt(Object val, int defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.parseInt(val.toString().trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}