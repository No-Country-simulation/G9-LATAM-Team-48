package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;

import java.util.List;

/**
 * Catalogo estatico de recomendaciones (demo / hackathon).
 */
final class RecommendationCatalog {

    private RecommendationCatalog() {
    }

    static List<RecommendationItem> all() {
        return List.of(
                new RecommendationItem(1, "lighting", "high", "12%"),
                new RecommendationItem(2, "habits", "high", "8%"),
                new RecommendationItem(3, "climate", "medium", "15%"),
                new RecommendationItem(4, "equipment", "medium", "10%"),
                new RecommendationItem(5, "habits", "low", "3%"),
                new RecommendationItem(6, "tech", "medium", "11%")
        );
    }

    static List<RecommendationItem> forCategory(String category) {
        String normalized = category == null ? "" : category.toLowerCase();
        List<RecommendationItem> all = all();

        if (normalized.contains("efficient") || normalized.contains("low")) {
            return all.stream()
                    .filter(item -> "low".equals(item.priorityKey()) || "medium".equals(item.priorityKey()))
                    .toList();
        }
        if (normalized.contains("inefficient") || normalized.contains("high")) {
            return all.stream()
                    .filter(item -> !"low".equals(item.priorityKey()))
                    .toList();
        }
        return all;
    }
}
