package com.alura.recommendation.dto;

import com.alura.analisis.service.AnalisisFeatureCalculator;
import com.alura.recommendation.support.RecommendationRequestMapper;

import java.util.Locale;
import java.util.Map;

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
        Boolean usoHorarioPico,
        Double pctIluminacionLed,
        String aislamientoTermico,
        Double antiguedadElectrodomesticosAnios,
        Double consumoPorPersona,
        Double factorAislamientoCalculado,
        Double proporcionLedCalculada
) {
    public static RecommendationRequest fromAnalysisFeatures(
            Map<String, Object> features, String nivelKey, String userId) {
        return fromAnalysisFeatures(features, nivelKey, userId, null);
    }

    /**
     * Enriquece el request con métricas derivadas (SHAP) cuando se provee el calculador.
     */
    public static RecommendationRequest fromAnalysisFeatures(
            Map<String, Object> features, String nivelKey, String userId,
            AnalisisFeatureCalculator calculator) {
        if (features == null) {
            features = Map.of();
        }
        Double derivedConsumoPerPerson = null;
        Double derivedInsulation = null;
        Double derivedLed = null;
        if (calculator != null) {
            derivedConsumoPerPerson = calculator.calculateConsumptionPerPerson(features).doubleValue();
            derivedInsulation = calculator.calculateInsulationFactor(features).doubleValue();
            derivedLed = calculator.calculateLedProportion(features).doubleValue();
        }
        return new RecommendationRequest(
                userId,
                RecommendationRequestMapper.mapNivelToCategoryModel(nivelKey),
                RecommendationRequestMapper.mapTipoInmueble(features),
                intOrNull(features, "cantidad_equipos_total", "cantidadEquipos", "cantidad_equipos"),
                intOrNull(features, "horas_uso_aa_dia", "horasClimatizacion", "horas_climatizacion"),
                intOrNull(features, "horasAltoConsumo", "horas_alto_consumo"),
                boolOrNull(features.get("usoHorarioPico")),
                doubleOrNull(features, "pct_iluminacion_led", "pctIluminacionLed"),
                stringOrNull(features, "aislamiento_termico", "aislamientoTermico"),
                doubleOrNull(features, "antiguedad_electrodomesticos_anios", "antiguedadElectrodomesticosAnios"),
                derivedConsumoPerPerson,
                derivedInsulation,
                derivedLed);
    }

    /** {@code true} para perfiles MODERADO/ALTO (reglas SHAP detalladas). */
    public boolean requiresDetailedAnalysis() {
        if (category == null) {
            return false;
        }
        String normalized = category.trim().toUpperCase(Locale.ROOT);
        return !"BAJO".equals(normalized) && !"LOW".equals(normalized) && !"EFFICIENT".equals(normalized);
    }

    /** Porcentaje LED efectivo: formulario o métrica calculada (0–100). */
    public Double effectivePctIluminacionLed() {
        if (pctIluminacionLed != null) {
            return pctIluminacionLed;
        }
        if (proporcionLedCalculada != null) {
            return proporcionLedCalculada * 100.0;
        }
        return null;
    }

    private static Integer intOrNull(Map<String, Object> map, String... keys) {
        Double d = doubleOrNull(map, keys);
        return d != null ? d.intValue() : null;
    }

    private static Double doubleOrNull(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (!map.containsKey(key) || map.get(key) == null) {
                continue;
            }
            try {
                return Double.parseDouble(String.valueOf(map.get(key)).trim());
            } catch (NumberFormatException ignored) {
                // try next key
            }
        }
        return null;
    }

    private static String stringOrNull(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key) && map.get(key) != null) {
                return String.valueOf(map.get(key)).trim();
            }
        }
        return null;
    }

    private static Boolean boolOrNull(Object value) {
        if (value instanceof Boolean b) {
            return b;
        }
        if (value == null) {
            return null;
        }
        String s = String.valueOf(value).trim().toLowerCase(Locale.ROOT);
        if ("true".equals(s) || "1".equals(s) || "si".equals(s)) {
            return true;
        }
        if ("false".equals(s) || "0".equals(s) || "no".equals(s)) {
            return false;
        }
        return null;
    }
}
