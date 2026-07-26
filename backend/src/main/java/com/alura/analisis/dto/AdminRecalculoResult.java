package com.alura.analisis.dto;

/**
 * Resumen del recalculo masivo de consultas historicas.
 */
public record AdminRecalculoResult(
        int total,
        int updated,
        int unchanged,
        int skipped
) {
}
