package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionResponse;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Clasificacion heuristica cuando el microservicio FastAPI no esta disponible
 * (p. ej. Render en cold start o ML caído).
 *
 * <p>Reemplaza al antiguo {@code MockPredictionService} (contratos tipados
 * incompatibles con el {@code PredictionRequest}/{@code PredictionResponse} actual).
 * Combina:
 * <ul>
 *   <li>benchmark por tipo de inmueble (flujo actual),</li>
 *   <li>score por habitos del mock del equipo (consumo, pico, horas altas, equipos).</li>
 * </ul>
 */
final class HeuristicPrediction {

    private HeuristicPrediction() {
    }

    static PredictionResponse fromFeatures(Map<String, Object> features) {
        String tipo = normalizeTipo(features);
        double consumo = firstDouble(features, 0, "consumo_kwh_mensual", "consumoKwh", "consumo");
        double personas = firstDouble(features, defaultPersonas(tipo), "num_personas", "cantidadPersonas", "personas");
        double area = firstDouble(features, defaultArea(tipo), "superficie_m2", "areaM2", "area");
        double climate = firstDouble(features, 2, "horas_uso_aa_dia", "horasClimatizacion", "climateHours");
        double equipos = firstDouble(features, 0, "cantidad_equipos_total", "cantidadEquipos", "equipos");
        double horasAlto = firstDouble(features, 0, "horasAltoConsumo", "peakUseHours");
        boolean usoPico = Boolean.TRUE.equals(asBoolean(features.get("usoHorarioPico")));

        double base = switch (tipo) {
            case "APARTAMENTO" -> 220;
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" -> 650;
            default -> 300;
        };
        double personFactor = "PEQUENO_ESTABLECIMIENTO_COMERCIAL".equals(tipo) ? 70 : 55;
        double areaFactor = "PEQUENO_ESTABLECIMIENTO_COMERCIAL".equals(tipo) ? 2.2 : 1.2;
        double benchmark = Math.round(base * 0.45 + personas * personFactor + area * areaFactor + climate * 25);

        double ratio = benchmark <= 0 ? 1 : consumo / benchmark;
        // Score del mock tipado del equipo (feat-backend-prediction-mock-german).
        int habitScore = 0;
        if (consumo >= 500) {
            habitScore += 2;
        } else if (consumo >= 250) {
            habitScore++;
        }
        if (usoPico) {
            habitScore++;
        }
        if (horasAlto >= 8) {
            habitScore++;
        }
        if (equipos >= 10) {
            habitScore++;
        }

        String nivelKey;
        String category;
        int ahorro;
        double confidence;

        if (ratio <= 0.85 && habitScore <= 1) {
            nivelKey = "efficient";
            category = "efficient";
            ahorro = 5;
            confidence = 0.72;
        } else if (ratio > 1.15 || habitScore >= 3) {
            nivelKey = "inefficient";
            category = "inefficient";
            ahorro = habitScore >= 4 ? 32 : 28;
            confidence = 0.74;
        } else {
            nivelKey = "moderate";
            category = "moderate";
            ahorro = 15;
            confidence = 0.68;
        }

        List<String> tipKeys = List.of();

        return new PredictionResponse(
                null,
                category,
                nivelKey,
                confidence,
                ahorro,
                tipKeys,
                benchmark);
    }

    private static double defaultPersonas(String tipo) {
        return "APARTAMENTO".equals(tipo) ? 2 : 3;
    }

    private static double defaultArea(String tipo) {
        return "APARTAMENTO".equals(tipo) ? 55 : 80;
    }

    private static String normalizeTipo(Map<String, Object> features) {
        Object raw = features.get("tipoInmueble");
        if (raw == null) {
            raw = features.get("tipo_inmueble");
        }
        if (raw == null) {
            raw = features.get("tipo");
        }
        String tipo = String.valueOf(raw != null ? raw : "CASA_UNIFAMILIAR").trim();
        return switch (tipo.toLowerCase(Locale.ROOT)) {
            case "casa", "casa_unifamiliar", "casa unifamiliar" -> "CASA_UNIFAMILIAR";
            case "apartamento", "departamento" -> "APARTAMENTO";
            case "pequeno_establecimiento_comercial",
                    "pequeño_establecimiento_comercial",
                    "pequeño establecimiento comercial",
                    "comercio",
                    "local_comercial" -> "PEQUENO_ESTABLECIMIENTO_COMERCIAL";
            case "fabrica_mediana" -> "FABRICA_MEDIANA";
            case "fabrica_grande" -> "FABRICA_GRANDE";
            default -> tipo.toUpperCase(Locale.ROOT);
        };
    }

    private static double firstDouble(Map<String, Object> features, double fallback, String... keys) {
        for (String key : keys) {
            if (features.containsKey(key) && features.get(key) != null) {
                return toDouble(features.get(key), fallback);
            }
        }
        return fallback;
    }

    private static Boolean asBoolean(Object value) {
        if (value instanceof Boolean b) {
            return b;
        }
        if (value == null) {
            return null;
        }
        String s = String.valueOf(value).trim().toLowerCase(Locale.ROOT);
        if ("true".equals(s) || "1".equals(s) || "yes".equals(s) || "si".equals(s)) {
            return true;
        }
        if ("false".equals(s) || "0".equals(s) || "no".equals(s)) {
            return false;
        }
        return null;
    }

    private static double toDouble(Object value, double fallback) {
        if (value == null) {
            return fallback;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        try {
            return Double.parseDouble(String.valueOf(value).trim());
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }
}
