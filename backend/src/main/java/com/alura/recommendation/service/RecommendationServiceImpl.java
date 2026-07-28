package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.RecommendationRule;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Motor de recomendaciones: evalúa las reglas de negocio (Strategy)
 * para generar las claves de recomendación (TipKeys).
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;

    public RecommendationServiceImpl(List<RecommendationRule> rules) {
        this.rules = rules;
    }

    @Override
    public RecommendationResponse generate(RecommendationRequest request) {
        if (request == null) {
            return new RecommendationResponse(null, List.of("default"));
        }

        // Filtramos las reglas que aplican, obtenemos el TipKey,
        // lo pasamos a minúsculas (para el frontend) y evitamos duplicados
        List<String> tipKeys = rules.stream()
                .filter(rule -> rule.applies(request))
                .map(rule -> rule.evaluate(request).name().toLowerCase())
                .distinct()
                .toList();

        if (tipKeys.isEmpty()) {
            tipKeys = List.of("default");
        }

        return new RecommendationResponse(request.userId(), tipKeys);
    }
}