package com.alura.recommendation.dto;

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
        Double antiguedadElectrodomesticosAnios
) {
    public static RecommendationRequest fromAnalysisFeatures(
            Map<String, Object> features, String nivelKey, String userId) {
        if (features == null) {
            features = Map.of();
        }
        return new RecommendationRequest(
                userId,
                RecommendationRequestMapper.mapNivelToCategoryModel(nivelKey),
                RecommendationRequestMapper.mapTipoInmueble(features),
                intOrNull(features, "cantidad_equipos_total", "cantidadEquipos"),
                intOrNull(features, "horas_uso_aa_dia", "horasClimatizacion"),
                intOrNull(features, "horasAltoConsumo", "horas_alto_consumo"),
                boolOrNull(features.get("usoHorarioPico")),
                doubleOrNull(features, "pct_iluminacion_led", "pctIluminacionLed"),
                stringOrNull(features, "aislamiento_termico", "aislamientoTermico"),
                doubleOrNull(features, "antiguedad_electrodomesticos_anios", "antiguedadElectrodomesticosAnios"));
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
