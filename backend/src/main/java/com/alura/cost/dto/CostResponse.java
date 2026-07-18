package com.alura.cost.dto;

/**
 * Contrato de salida del modulo de costos.
 *
 * @param userId        identificador del usuario
 * @param estimatedCost costo total estimado del consumo
 * @param currency      moneda del costo estimado (por ejemplo "USD")
 */
public record CostResponse(
        String userId,
        double estimatedCost,
        String currency
) {
}
