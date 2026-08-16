package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.persistence.RecommendationCatalogEntity;
import com.alura.recommendation.persistence.RecommendationCatalogRepository;
import com.alura.recommendation.persistence.UserRecommendationEntity;
import com.alura.recommendation.persistence.UserRecommendationRepository;
import com.alura.recommendation.rules.RecommendationRule;
import lombok.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

/**
 * Motor de reglas + catálogo V2 ({@code recommendation_catalog}).
 * <p>Sin login o sin filas personales: listado completo del catálogo en BD.
 * Con login y {@code user_recommendations} ACTIVE: solo las asignadas al usuario (misma BD).</p>
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;
    private final RecommendationCatalogRepository catalogRepository;
    private final UserRecommendationRepository userRecommendationRepository;
    private final RecommendationCatalogMapper catalogMapper;

    public RecommendationServiceImpl(
            @NonNull List<RecommendationRule> rules,
            RecommendationCatalogRepository catalogRepository,
            UserRecommendationRepository userRecommendationRepository,
            RecommendationCatalogMapper catalogMapper) {
        this.rules = rules;
        this.catalogRepository = catalogRepository;
        this.userRecommendationRepository = userRecommendationRepository;
        this.catalogMapper = catalogMapper;
    }

    @Override
    public RecommendationResponse generate(RecommendationRequest request) {
        if (request == null) {
            return new RecommendationResponse(null, List.of("default"));
        }

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

    /**
     * Siempre basado en {@code recommendation_catalog}. Si hay email de sesión y filas ACTIVE en
     * {@code user_recommendations}, devuelve ese subconjunto; si no, el catálogo completo.
     */
    @Transactional(readOnly = true)
    public List<RecommendationItem> listForFrontend(
            String category, String nivel, String domain, String userEmail) {
        List<RecommendationCatalogEntity> catalogRows = catalogRepository.findAll();
        if (catalogRows.isEmpty()) {
            return List.of();
        }

        if (isAuthenticated(userEmail)) {
            List<UserRecommendationEntity> personal = userRecommendationRepository.findActiveForUser(
                    userEmail, UserRecommendationEntity.STATUS_ACTIVE);
            if (!personal.isEmpty()) {
                return personal.stream()
                        .map(UserRecommendationEntity::getRecommendation)
                        .filter(row -> matchesCatalogNivel(row, nivel))
                        .filter(row -> matchesCatalogDomain(row, domain))
                        .map(catalogMapper::toFrontendItem)
                        .filter(item -> matchesCategory(item, category))
                        .toList();
            }
        }

        return catalogRows.stream()
                .filter(row -> matchesCatalogNivel(row, nivel))
                .filter(row -> matchesCatalogDomain(row, domain))
                .map(catalogMapper::toFrontendItem)
                .filter(item -> matchesCategory(item, category))
                .toList();
    }

    private static boolean isAuthenticated(String userEmail) {
        return userEmail != null && !userEmail.isBlank();
    }

    private static boolean matchesCategory(RecommendationItem item, String category) {
        if (category == null || category.isBlank()) {
            return true;
        }
        String normalized = category.toLowerCase(Locale.ROOT);
        if (normalized.contains("efficient") || normalized.contains("low")) {
            return "low".equals(item.priorityKey()) || "medium".equals(item.priorityKey());
        }
        if (normalized.contains("inefficient") || normalized.contains("high")) {
            return !"low".equals(item.priorityKey());
        }
        return true;
    }

    static boolean matchesCatalogNivel(RecommendationCatalogEntity row, String nivel) {
        if (nivel == null || nivel.isBlank()) {
            return true;
        }
        if (row.getNivel() == null || row.getNivel().isBlank()) {
            return true;
        }
        return row.getNivel().equalsIgnoreCase(nivel.trim());
    }

    static boolean matchesCatalogDomain(RecommendationCatalogEntity row, String domain) {
        if (domain == null || domain.isBlank()) {
            return true;
        }
        if (row.getCategoryKey() == null || row.getCategoryKey().isBlank()) {
            return true;
        }
        return row.getCategoryKey().equalsIgnoreCase(domain.trim());
    }
}
