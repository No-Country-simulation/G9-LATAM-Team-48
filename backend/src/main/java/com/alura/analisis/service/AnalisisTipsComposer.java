package com.alura.analisis.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.dto.TipKey;
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
 * Adaptado al Motor de Recomendaciones V2 con soporte para fallbacks de userId y variables SHAP.
 */
@Component
public class AnalisisTipsComposer {

    private static final int MAX_TIPS = 6;
    private static final Long DEFAULT_USER_ID = 1L;

    private final RecommendationService recommendationService;

    public AnalisisTipsComposer(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    public List<String> compose(PredictionResponse result, Map<String, Object> features, String userId) {
        if (result == null) {
            return List.of(TipKey.MEDIUM_CONSUMPTION_BASE.name().toLowerCase(Locale.ROOT));
        }
        String nivelKey = result.nivelKey() != null ? result.nivelKey() : "moderate";

        Long parsedUserId = parseUserId(userId);
        ConsumptionCategory category = ConsumptionCategory.fromModelValue(nivelKey);

        // Fallbacks seguros para variables SHAP si el formulario frontend no las envía directamente
        BigDecimal consumoPorPersona = parseBigDecimal(features != null ? features.get("consumo_anterior_por_persona") : null);
        if (consumoPorPersona == null) {
            consumoPorPersona = new BigDecimal("160.0"); // Valor por defecto seguro sobre umbral moderado
        }

        BigDecimal factorAislamiento = parseBigDecimal(features != null ? features.get("factor_aislamiento") : null);
        if (factorAislamiento == null) {
            factorAislamiento = new BigDecimal("1.0"); // Regular por defecto
        }

        BigDecimal proporcionLed = parseBigDecimal(features != null ? features.get("proporcion_iluminacion_led") : null);
        if (proporcionLed == null) {
            proporcionLed = new BigDecimal("0.40"); // 40% por defecto para propiciar mejora
        }

        BigDecimal consumoKwh = parseBigDecimal(features != null ? features.get("consumo_kwh_mensual") : null);

        RecommendationRequest request = RecommendationRequest.builder()
                .userId(parsedUserId)
                .category(category)
                .consumoAnteriorPorPersona(consumoPorPersona)
                .factorAislamiento(factorAislamiento)
                .proporcionIluminacionLed(proporcionLed)
                .consumoKwhMensual(consumoKwh)
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
            merged.add(TipKey.MEDIUM_CONSUMPTION_BASE.name().toLowerCase(Locale.ROOT));
        }

        return new ArrayList<>(merged).stream().limit(MAX_TIPS).toList();
    }

    private Long parseUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return DEFAULT_USER_ID;
        }
        String trimmed = userId.trim();
        try {
            return Long.valueOf(trimmed);
        } catch (NumberFormatException e) {
            // Si el userId es un token/email (ej. sesión de JWT de Germán), generamos un hash positivo estable
            // para evitar que falle el análisis, manteniendo consistencia en el historial del usuario.
            return Math.abs((long) trimmed.hashCode()) % 1000000L + 1L;
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
            case "efficient" -> List.of(TipKey.LOW_CONSUMPTION_BASE.name().toLowerCase(Locale.ROOT));
            case "inefficient" -> List.of(TipKey.HIGH_CONSUMPTION_BASE.name().toLowerCase(Locale.ROOT), TipKey.INSULATION_DEFICIENT.name().toLowerCase(Locale.ROOT));
            default -> List.of(TipKey.MEDIUM_CONSUMPTION_BASE.name().toLowerCase(Locale.ROOT), TipKey.LED_UPGRADE_NEEDED.name().toLowerCase(Locale.ROOT));
        };
    }
}