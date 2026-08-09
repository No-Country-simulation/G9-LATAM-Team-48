package com.alura.recommendation.support;

import com.alura.recommendation.dto.RecommendationRequest;
import org.springframework.stereotype.Component;

@Component
public class RecommendationRequestMapper {

    /**
     * Componente auxiliar para mapear solicitudes externas hacia el contrato del motor V2.
     * TODO: Implementar el mapeo completo extrayendo la categoría y variables SHAP del rawPayload.
     */
    public RecommendationRequest map(Long userId, Object rawPayload) {
        // Lanzamos excepción explícita (Fail-Fast) para evitar que pase un request inválido al servicio
        throw new UnsupportedOperationException("Mapeo hacia RecommendationRequest V2 aún no implementado. Faltan definir extracción de categoría y variables SHAP.");
    }
}