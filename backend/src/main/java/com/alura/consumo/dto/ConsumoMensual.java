package com.alura.consumo.dto;

/**
 * Registro mensual alineado al frontend ({@code mes}, {@code consumo}, {@code costo}).
 */
public record ConsumoMensual(
        String mes,
        int consumo,
        int costo
) {
}
