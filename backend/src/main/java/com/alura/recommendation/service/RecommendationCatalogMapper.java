package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.persistence.RecommendationCatalogEntity;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class RecommendationCatalogMapper {

    public RecommendationItem toFrontendItem(RecommendationCatalogEntity entity) {
        String type = entity.getType() != null ? entity.getType().toUpperCase(Locale.ROOT) : "INFO";
        return new RecommendationItem(
                entity.getId().intValue(),
                categoryKeyFor(entity.getTipKey(), type),
                priorityKeyForType(type),
                estimatedSavingsForType(type),
                entity.getTitle(),
                entity.getTitle());
    }

    private static String priorityKeyForType(String type) {
        return switch (type) {
            case "ALERTA" -> "high";
            case "OPORTUNIDAD" -> "medium";
            default -> "low";
        };
    }

    private static String estimatedSavingsForType(String type) {
        return switch (type) {
            case "ALERTA" -> "12%";
            case "OPORTUNIDAD" -> "8%";
            default -> "5%";
        };
    }

    private static String categoryKeyFor(String tipKey, String type) {
        if (tipKey == null) {
            return "habits";
        }
        String key = tipKey.toUpperCase(Locale.ROOT);
        if (key.contains("AC") || key.contains("HVAC") || key.contains("CLIMAT")) {
            return "climate";
        }
        if (key.contains("LED") || key.contains("LIGHT") || key.contains("ILUMIN")) {
            return "lighting";
        }
        if (key.contains("COMMERCIAL") || key.contains("EQUIP") || key.contains("CIRCUIT")) {
            return "equipment";
        }
        if ("ALERTA".equals(type)) {
            return "climate";
        }
        return "habits";
    }
}
