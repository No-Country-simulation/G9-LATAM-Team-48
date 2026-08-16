package com.alura.recommendation.service;

import com.alura.recommendation.persistence.RecommendationCatalogEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RecommendationCatalogFilterTest {

    private static RecommendationCatalogEntity row(String nivel, String categoryKey) {
        RecommendationCatalogEntity entity = new RecommendationCatalogEntity();
        entity.setNivel(nivel);
        entity.setCategoryKey(categoryKey);
        return entity;
    }

    @Test
    @DisplayName("Sin filtro de nivel incluye filas con cualquier nivel")
    void shouldIncludeAllWhenNivelNotProvided() {
        assertTrue(RecommendationServiceImpl.matchesCatalogNivel(row("moderate", "climate"), null));
        assertTrue(RecommendationServiceImpl.matchesCatalogNivel(row("moderate", "climate"), "  "));
    }

    @Test
    @DisplayName("Fila sin nivel aplica a todos los perfiles")
    void shouldIncludeUniversalRowsWhenNivelProvided() {
        assertTrue(RecommendationServiceImpl.matchesCatalogNivel(row(null, "climate"), "moderate"));
    }

    @Test
    @DisplayName("Filtra por nivel cuando la fila tiene nivel explícito")
    void shouldFilterByNivel() {
        RecommendationCatalogEntity moderate = row("moderate", "climate");
        assertTrue(RecommendationServiceImpl.matchesCatalogNivel(moderate, "moderate"));
        assertFalse(RecommendationServiceImpl.matchesCatalogNivel(moderate, "efficient"));
    }

    @Test
    @DisplayName("Filtra por dominio category_key")
    void shouldFilterByDomain() {
        RecommendationCatalogEntity climate = row("moderate", "climate");
        assertTrue(RecommendationServiceImpl.matchesCatalogDomain(climate, "climate"));
        assertFalse(RecommendationServiceImpl.matchesCatalogDomain(climate, "lighting"));
    }
}
