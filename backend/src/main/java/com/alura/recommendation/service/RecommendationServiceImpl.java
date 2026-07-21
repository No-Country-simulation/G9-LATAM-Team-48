package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.RecommendationRule;
import lombok.NonNull;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

/**
 * Motor de recomendaciones: reglas Strategy + catalogo para el contrato del frontend.
 *
 * <p>{@link #generate} usa las reglas {@link RecommendationRule} (i18n MessageSource).
 * {@link #listForFrontend} mantiene el catalogo tipado que consume la UI.</p>
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;
    private final MessageSource messageSource;

    public RecommendationServiceImpl(
            @NonNull List<RecommendationRule> rules,
            @NonNull MessageSource messageSource) {
        this.rules = rules;
        this.messageSource = messageSource;
    }

    @Override
    public RecommendationResponse generate(RecommendationRequest request) {
        if (request == null) {
            return new RecommendationResponse(null, List.of(resolveDefaultMessage()));
        }

        List<String> recommendations = rules.stream()
                .filter(rule -> rule.applies(request))
                .map(rule -> rule.evaluate(request))
                .toList();

        if (recommendations.isEmpty()) {
            recommendations = List.of(resolveDefaultMessage());
        }

        return new RecommendationResponse(request.userId(), recommendations);
    }

    public List<RecommendationItem> listForFrontend(String category) {
        if (category == null || category.isBlank()) {
            return RecommendationCatalog.all();
        }
        return RecommendationCatalog.forCategory(category);
    }

    private String resolveDefaultMessage() {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage("recommendation.default", null, locale);
    }
}
