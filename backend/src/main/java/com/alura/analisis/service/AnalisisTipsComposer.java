package com.alura.analisis.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationService;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Combina reglas de recomendación, tips del ML/heurística y sugerencias base por nivelKey.
 * Adaptado al Motor de Recomendaciones V2.
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

        Long parsedUserId = parseUserId(userId);
        ConsumptionCategory category = ConsumptionCategory.fromModelValue(nivelKey);

        RecommendationRequest request = RecommendationRequest.builder()
                .userId(parsedUserId)
                .category(category)
                .consumoAnteriorPorPersona(parseBigDecimal(features != null ? features.get("consumo_anterior_por_persona") : null))
                .factorAislamiento(parseBigDecimal(features != null ? features.get("factor_aislamiento") : null))
                .proporcionIluminacionLed(parseBigDecimal(features != null ? features.get("proporcion_iluminacion_led") : null))
                .consumoKwhMensual(parseBigDecimal(features != null ? features.get("consumo_kwh_mensual") : null))
                .build();

        RecommendationResponse response = recommendationService.generateRecommendations(request);
        
        List<String> fromRules = new ArrayList<>();
        if (response != null && response.getRecommendations() != null) {
            for (RecommendationItem item : response.getRecommendations()) {
                if (item.getTipKey() != null) {
                    fromRules.add(item.getTipKey().name().toLowerCase(Locale.ROOT));
                }
            }
        }

        Set<String> merged = new LinkedHashSet<>();
        if (!fromRules.isEmpty()) {
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

    private Long parseUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return 1L;
        }
        try {
            return Long.valueOf(userId.trim());
        } catch (NumberFormatException e) {
            return 1L;
        }
    }

    private BigDecimal parseBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        try {
            String str = value.toString().trim();
            if (str.isEmpty()) {
                return null;
            }
            return new BigDecimal(str);
        } catch (Exception e) {
            return null;
        }
    }

    private static List<String> baseTipsForNivel(String nivelKey) {
        return switch (String.valueOf(nivelKey).toLowerCase(Locale.ROOT)) {
            case "efficient" -> List.of("keep", "monitor");
            case "inefficient" -> List.of("replace", "insulation", "schedules");
            default -> List.of("led", "appliances", "peak");
        };
    }
}