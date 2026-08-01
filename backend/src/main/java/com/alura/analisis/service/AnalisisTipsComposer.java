package com.alura.analisis.service;

import com.alura.prediction.dto.PredictionResponse;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.service.RecommendationService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Combina reglas de recomendación, tips del ML/heurística y sugerencias base por {@code nivelKey}.
 */
@Component
public class AnalisisTipsComposer {

    private static final int MAX_TIPS = 6;

    private final RecommendationService recommendationService;

    public AnalisisTipsComposer(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    public List<String> compose(PredictionResponse result, Map<String, Object> features, String userId) {
        if (result == null) {
            return List.of("default");
        }
        String nivelKey = result.nivelKey() != null ? result.nivelKey() : "moderate";

        RecommendationRequest request = RecommendationRequest.fromAnalysisFeatures(features, nivelKey, userId);
        List<String> fromRules = recommendationService.generate(request).recommendations();

        Set<String> merged = new LinkedHashSet<>();
        if (fromRules != null) {
            merged.addAll(fromRules);
        }
        if (result.tipKeys() != null) {
            merged.addAll(result.tipKeys());
        }
        for (String base : baseTipsForNivel(nivelKey)) {
            merged.add(base);
        }

        if (merged.isEmpty()) {
            merged.add("default");
        }

        return new ArrayList<>(merged).stream().limit(MAX_TIPS).toList();
    }

    private static List<String> baseTipsForNivel(String nivelKey) {
        return switch (String.valueOf(nivelKey).toLowerCase(Locale.ROOT)) {
            case "efficient" -> List.of("keep", "monitor");
            case "inefficient" -> List.of("replace", "insulation", "schedules");
            default -> List.of("led", "appliances", "peak");
        };
    }
}
