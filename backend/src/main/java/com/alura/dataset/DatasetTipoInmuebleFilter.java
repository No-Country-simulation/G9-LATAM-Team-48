package com.alura.dataset;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

/**
 * Filtro por tipo de inmueble (one-hot del dataset), alineado con {@code AnalisisPayload} / frontend.
 */
public final class DatasetTipoInmuebleFilter {

    private static final List<String> ALL_KEYS =
            List.of("APARTAMENTO", "CASA_UNIFAMILIAR", "PEQUENO_ESTABLECIMIENTO_COMERCIAL");

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

    /** CSV o valor único desde query {@code tipoInmueble=APARTAMENTO,CASA_UNIFAMILIAR}. */
    public static List<String> parseParam(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        Set<String> keys = new LinkedHashSet<>();
        for (String part : raw.split(",")) {
            normalizeKey(part).ifPresent(keys::add);
        }
        return List.copyOf(keys);
    }

    /** Fragmento SQL {@code AND (...)} — vacío si no hay filtro o están los 3 tipos. */
    public static String sqlOrClause(List<String> tipos) {
        if (tipos == null || tipos.isEmpty() || tipos.size() >= ALL_KEYS.size()) {
            return "";
        }
        if (tipos.size() == 1) {
            return " AND (" + segmentPredicate(tipos.getFirst()) + ") ";
        }
        List<String> parts = new ArrayList<>();
        for (String key : tipos) {
            parts.add("(" + segmentPredicate(key) + ")");
        }
        return " AND (" + String.join(" OR ", parts) + ") ";
    }

    private static String segmentPredicate(String key) {
        return switch (key) {
            case "APARTAMENTO" ->
                    """
                    COALESCE(tipo_inmueble_apartamento, 0)
                        >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                    AND COALESCE(tipo_inmueble_apartamento, 0)
                        >= COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                    AND COALESCE(tipo_inmueble_apartamento, 0) > 0
                    """;
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" ->
                    """
                    COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                        >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                    AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                        >= COALESCE(tipo_inmueble_apartamento, 0)
                    AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0) > 0
                    """;
            default ->
                    """
                    NOT (
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

    public static List<String> allKeys() {
        return ALL_KEYS;
    }
}
