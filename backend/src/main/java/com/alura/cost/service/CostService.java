package com.alura.cost.service;

import com.alura.cost.dto.CostRequest;
import com.alura.cost.dto.CostResponse;

/**
 * Calcula el costo energetico estimado a partir del consumo y la tarifa.
 *
 * <p>Sin implementacion todavia.</p>
 */
public interface CostService {

    /**
     * Estima el costo del consumo energetico.
     *
     * @param request datos de consumo y tarifa
     * @return costo estimado
     */
    CostResponse estimate(CostRequest request);
}
