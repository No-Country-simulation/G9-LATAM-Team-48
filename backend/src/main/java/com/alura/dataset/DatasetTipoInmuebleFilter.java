package com.alura.dataset;

import java.util.Locale;
import java.util.Optional;

/**
 * Filtro por tipo de inmueble (one-hot del dataset), alineado con {@code AnalisisPayload} / frontend.
 */
public final class DatasetTipoInmuebleFilter {

    private DatasetTipoInmuebleFilter() {}

    public static Optional<String> normalizeKey(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String token = raw.trim();
        if ("all".equalsIgnoreCase(token)) {
            return Optional.empty();
        }
        String upper = token.toUpperCase(Locale.ROOT).replace(' ', '_');
        return switch (upper) {
            case "APARTAMENTO" -> Optional.of("APARTAMENTO");
            case "CASA_UNIFAMILIAR", "CASA" -> Optional.of("CASA_UNIFAMILIAR");
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL", "PEQUEÑO_ESTABLECIMIENTO_COMERCIAL", "COMERCIAL" ->
                    Optional.of("PEQUENO_ESTABLECIMIENTO_COMERCIAL");
            default -> {
                String lower = token.toLowerCase(Locale.ROOT);
                if (lower.contains("apartamento")) {
                    yield Optional.of("APARTAMENTO");
                }
                if (lower.contains("comercial") || lower.contains("establecimiento")) {
                    yield Optional.of("PEQUENO_ESTABLECIMIENTO_COMERCIAL");
                }
                if (lower.contains("casa")) {
                    yield Optional.of("CASA_UNIFAMILIAR");
                }
                yield Optional.empty();
            }
        };
    }

    /** Fragmento SQL {@code AND ...} para restringir filas al segmento dominante. */
    public static String sqlAndClause(String tipoKey) {
        Optional<String> key = normalizeKey(tipoKey);
        if (key.isEmpty()) {
            return "";
        }
        return switch (key.get()) {
            case "APARTAMENTO" ->
                    """
                     AND COALESCE(tipo_inmueble_apartamento, 0)
                         >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                     AND COALESCE(tipo_inmueble_apartamento, 0)
                         >= COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                     AND COALESCE(tipo_inmueble_apartamento, 0) > 0
                    """;
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" ->
                    """
                     AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                         >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                     AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                         >= COALESCE(tipo_inmueble_apartamento, 0)
                     AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0) > 0
                    """;
            default ->
                    """
                     AND NOT (
                         COALESCE(tipo_inmueble_apartamento, 0)
                             >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                         AND COALESCE(tipo_inmueble_apartamento, 0)
                             >= COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                         AND COALESCE(tipo_inmueble_apartamento, 0) > 0
                     )
                     AND NOT (
                         COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                             >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                         AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0) > 0
                     )
                    """;
        };
    }

    /** Escala demo/fallback cuando no hay filas del dataset en DB. */
    public static double demoScaleFactor(String raw) {
        Optional<String> key = normalizeKey(raw);
        if (key.isEmpty()) {
            return 1.0;
        }
        return switch (key.get()) {
            case "APARTAMENTO" -> 220.0 / 300.0;
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" -> 650.0 / 300.0;
            default -> 1.0;
        };
    }
}
