package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.RecommendationRule;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Motor de recomendaciones: reglas Strategy + catálogo para el contrato del frontend.
 *
 * <p>{@link #generate} usa las reglas {@link RecommendationRule} para devolver claves cortas.
 * {@link #listForFrontend} mantiene el catálogo tipado que consume la UI.</p>
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

    public List<RecommendationItem> listForFrontend(String category) {
        if (category == null || category.isBlank()) {
            return RecommendationCatalog.all();
        }
        return RecommendationCatalog.forCategory(category);
    }
}