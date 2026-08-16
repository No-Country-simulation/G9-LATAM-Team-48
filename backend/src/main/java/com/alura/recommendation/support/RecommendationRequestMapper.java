package com.alura.recommendation.support;

import com.alura.common.constants.PropertyTypeConstants;
import com.alura.common.enums.ConsumptionCategory;

import java.util.Locale;
import java.util.Map;

public final class RecommendationRequestMapper {

    private RecommendationRequestMapper() {
    }

    public static String mapNivelToCategoryModel(String nivelKey) {
        if (nivelKey == null) {
            return ConsumptionCategory.MEDIUM.getModelValue();
        }
        return switch (nivelKey.toLowerCase(Locale.ROOT)) {
            case "efficient", "bajo", "low" -> ConsumptionCategory.LOW.getModelValue();
            case "inefficient", "alto", "high" -> ConsumptionCategory.HIGH.getModelValue();
            default -> ConsumptionCategory.MEDIUM.getModelValue();
        };
    }

    public static String mapTipoInmueble(Map<String, Object> features) {
        if (features == null) {
            return PropertyTypeConstants.HOUSE;
        }
        Object raw = features.get("tipoInmueble");
        if (raw == null) {
            raw = features.get("tipo_inmueble");
        }
        if (raw == null) {
            return PropertyTypeConstants.HOUSE;
        }
        String text = String.valueOf(raw).trim();
        if (text.equalsIgnoreCase("Apartamento")) {
            return PropertyTypeConstants.APARTMENT;
        }
        if (text.toLowerCase(Locale.ROOT).contains("comercial")
                || text.toLowerCase(Locale.ROOT).contains("establecimiento")) {
            return PropertyTypeConstants.COMMERCIAL;
        }
        return switch (text.toUpperCase(Locale.ROOT)) {
            case "APARTAMENTO" -> PropertyTypeConstants.APARTMENT;
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" -> PropertyTypeConstants.COMMERCIAL;
            default -> PropertyTypeConstants.HOUSE;
        };
    }
}
