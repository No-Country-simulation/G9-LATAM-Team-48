package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionResponse;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Clasificacion heuristica cuando el microservicio FastAPI no esta disponible
 * (tipico en Railway Hobby sin servicio ML desplegado).
 */
final class HeuristicPrediction {

    private HeuristicPrediction() {
    }

    static PredictionResponse fromFeatures(Map<String, Object> features) {
        String tipo = String.valueOf(features.getOrDefault("tipo", "casa"))
                .trim()
                .toLowerCase(Locale.ROOT);
        double consumo = toDouble(features.get("consumo"), 0);
        double benchmark = switch (tipo) {
            case "fabrica_mediana" -> 2500;
            case "fabrica_grande" -> 8000;
            default -> 450;
        };

        double ratio = benchmark <= 0 ? 1 : consumo / benchmark;
        String nivelKey;
        String category;
        int ahorro;
        double confidence;
        List<String> tipKeys;

        if (ratio <= 0.85) {
            nivelKey = "efficient";
            category = "efficient";
            ahorro = 5;
            confidence = 0.72;
            tipKeys = List.of("keep", "monitor", "standby");
        } else if (ratio <= 1.15) {
            nivelKey = "moderate";
            category = "moderate";
            ahorro = 15;
            confidence = 0.68;
            tipKeys = List.of("led", "peak", "appliances");
        } else {
            nivelKey = "inefficient";
            category = "inefficient";
            ahorro = 28;
            confidence = 0.74;
            tipKeys = List.of("ac", "replace", "peak", "standby");
        }

        if ("fabrica_mediana".equals(tipo) || "fabrica_grande".equals(tipo)) {
            tipKeys = ratio <= 0.85
                    ? List.of("keep", "monitor", "scada")
                    : List.of("shifts", "motors", "loadBalancing", "idleLines");
        }

        return new PredictionResponse(
                null,
                category,
                nivelKey,
                confidence,
                ahorro,
                tipKeys,
                benchmark);
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
