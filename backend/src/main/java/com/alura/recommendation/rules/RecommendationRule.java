package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;

/**
 * Contrato de una regla individual del motor de recomendaciones.
 *
 * <p>Cada regla es una estrategia independiente (patron Strategy). El servicio
 * de recomendaciones evaluara todas las reglas aplicables y compondra el
 * resultado. Anadir una nueva recomendacion consistira en crear una nueva
 * implementacion de esta interfaz, sin modificar el codigo existente
 * (principio Abierto/Cerrado).</p>
 *
 * <p>Implementaciones actuales: {@code HighConsumptionRule},
 * {@code MediumConsumptionRule} y {@code LowConsumptionRule}, una por cada
 * categoria de consumo devuelta por el modulo de prediccion.</p>
 */
public interface RecommendationRule {

    /**
     * Indica si la regla aplica al contexto dado.
     *
     * @param request contexto de evaluacion
     * @return {@code true} si la regla debe ejecutarse
     */
    boolean applies(RecommendationRequest request);

    /**
     * Genera el mensaje de recomendacion cuando la regla aplica.
     *
     * @param request contexto de evaluacion
     * @return texto de la recomendacion
     */
    String evaluate(RecommendationRequest request);
}
