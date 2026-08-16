package com.alura.cost.dto;

/**
 * Contrato de entrada del modulo de costos.
 *
 * @param userId             identificador del usuario
 * @param consumptionKwh     consumo energetico estimado en kWh
 * @param tariffPerKwh       tarifa energetica aplicada por kWh
 */
public record CostRequest(
        String userId,
        double consumptionKwh,
        double tariffPerKwh
) {
}
