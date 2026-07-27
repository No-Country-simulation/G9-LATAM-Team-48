package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación orientada a la mitigación del consumo fantasma (standby).
 *
 * <p>Aplica para inmuebles con una gran cantidad de equipos eléctricos conectados
 * de forma simultánea, donde el gasto pasivo impacta considerablemente en la tarifa.</p>
 *
 * @author miyo
 * @version 1.0
 */
@Component
public class StandbyPowerRule implements RecommendationRule {

    private static final int UMBRAL_EQUIPOS = 15;

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null
                && request.cantidadEquipos() != null
                && request.cantidadEquipos() >= UMBRAL_EQUIPOS;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.STANDBY;
    }
}