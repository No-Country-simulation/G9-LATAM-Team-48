package com.alura.analisis.dto;

/**
 * Resumen de un lote del recalculo de consultas historicas.
 *
 * <p>{@code total} es el total de filas existentes; el resto son contadores del
 * lote procesado. {@code hasMore} indica si quedan lotes pendientes.</p>
 */
public record AdminRecalculoResult(
        int total,
        int updated,
        int unchanged,
        int skipped,
        boolean hasMore
) {
}
