package com.alura.analisis.support;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Normaliza payloads guardados al contrato de 12 features del servicio ML.
 *
 * <p>El {@code requestJson} persistido mezcla claves snake_case del contrato ML
 * con las camelCase del formulario, y en {@code zona} ambas colisionan: queda el
 * valor crudo ({@code URBANA_INTERIOR}) en vez del esperado por el modelo
 * ({@code Urbana Interior}). Reprocesar esas filas requiere volver a mapearlas.</p>
 */
public final class MlFeatureNormalizer {

    private MlFeatureNormalizer() {
    }

    public static String tipoInmueble(String raw) {
        if (raw == null || raw.isBlank()) {
            return "Casa Unifamiliar";
        }
        String trimmed = raw.trim();
        return switch (trimmed.toUpperCase()) {
            case "APARTAMENTO" -> "Apartamento";
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL",
                 "PEQUEÑO ESTABLECIMIENTO COMERCIAL" -> "Pequeño Establecimiento Comercial";
            case "CASA_UNIFAMILIAR", "CASA", "CASA UNIFAMILIAR" -> "Casa Unifamiliar";
            default -> trimmed.contains(" ") ? trimmed : "Casa Unifamiliar";
        };
    }

    public static String aislamientoTermico(String raw) {
        if (raw == null || raw.isBlank()) {
            return "Regular";
        }
        return switch (raw.trim().toUpperCase()) {
            case "BUENO" -> "Bueno";
            case "MALO" -> "Malo";
            case "REGULAR" -> "Regular";
            default -> raw.trim();
        };
    }

    public static String zona(String raw) {
        if (raw == null || raw.isBlank()) {
            return "Urbana Interior";
        }
        return switch (raw.trim().toUpperCase()) {
            case "SUBURBANA" -> "Suburbana";
            case "URBANA_COSTERA", "URBANA COSTERA" -> "Urbana Costera";
            case "URBANA_INTERIOR", "URBANA INTERIOR" -> "Urbana Interior";
            default -> raw.trim();
        };
    }

    /**
     * Reconstruye las 12 features del modelo desde un request persistido,
     * aceptando tanto las claves del contrato ML como las del formulario.
     *
     * @return mapa listo para el ML, o vacio si falta el consumo mensual
     */
    public static Map<String, Object> fromStoredRequest(Map<String, Object> stored) {
        if (stored == null || stored.isEmpty()) {
            return Map.of();
        }

        Object consumo = first(stored, "consumo_kwh_mensual", "consumoKwh", "consumo");
        if (consumo == null) {
            return Map.of();
        }

        Map<String, Object> features = new LinkedHashMap<>();
        features.put("tipo_inmueble", tipoInmueble(
                text(first(stored, "tipo_inmueble", "tipoInmueble", "tipo"))));
        features.put("superficie_m2", number(first(stored, "superficie_m2", "areaM2"), 0));
        features.put("num_personas", integer(first(stored, "num_personas", "cantidadPersonas"), 1));
        features.put("cantidad_equipos_total",
                integer(first(stored, "cantidad_equipos_total", "cantidadEquipos"), 0));
        features.put("horas_uso_aa_dia",
                number(first(stored, "horas_uso_aa_dia", "horasClimatizacion"), 0));
        features.put("consumo_kwh_mensual", number(consumo, 0));
        features.put("consumo_kwh_mes_anterior",
                number(first(stored, "consumo_kwh_mes_anterior", "consumoKwhMesAnterior"), 0));
        features.put("aislamiento_termico", aislamientoTermico(
                text(first(stored, "aislamiento_termico", "aislamientoTermico"))));
        features.put("pct_iluminacion_led",
                number(first(stored, "pct_iluminacion_led", "pctIluminacionLed"), 0));
        features.put("antiguedad_construccion_anios",
                number(first(stored, "antiguedad_construccion_anios", "antiguedadConstruccionAnios"), 0));
        features.put("zona", zona(text(first(stored, "zona"))));
        features.put("antiguedad_electrodomesticos_anios",
                number(first(stored, "antiguedad_electrodomesticos_anios",
                        "antiguedadElectrodomesticosAnios"), 0));
        return features;
    }

    private static Object first(Map<String, Object> source, String... keys) {
        for (String key : keys) {
            Object value = source.get(key);
            if (value != null && !(value instanceof String s && s.isBlank())) {
                return value;
            }
        }
        return null;
    }

    private static String text(Object value) {
        return value != null ? String.valueOf(value) : null;
    }

    private static double number(Object value, double fallback) {
        if (value instanceof Number n) {
            return n.doubleValue();
        }
        if (value != null) {
            try {
                return Double.parseDouble(String.valueOf(value).trim().replace(',', '.'));
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }
        return fallback;
    }

    private static int integer(Object value, int fallback) {
        double parsed = number(value, fallback);
        return (int) Math.round(parsed);
    }
}
