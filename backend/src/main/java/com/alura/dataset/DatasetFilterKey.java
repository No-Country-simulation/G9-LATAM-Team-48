package com.alura.dataset;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Clave estable para rollups / cache del dashboard (alineada con query {@code tipoInmueble} del front). */
public final class DatasetFilterKey {

    public static final String ALL = "ALL";

    /** Todas las combinaciones de filtro que el front puede enviar (tipos ordenados alfabéticamente). */
    public static final List<String> ROLLUP_KEYS = List.of(
            ALL,
            "APARTAMENTO",
            "CASA_UNIFAMILIAR",
            "PEQUENO_ESTABLECIMIENTO_COMERCIAL",
            "APARTAMENTO,CASA_UNIFAMILIAR",
            "APARTAMENTO,PEQUENO_ESTABLECIMIENTO_COMERCIAL",
            "CASA_UNIFAMILIAR,PEQUENO_ESTABLECIMIENTO_COMERCIAL");

    private DatasetFilterKey() {}

    public static String fromParam(String tipoInmuebleParam) {
        List<String> tipos = DatasetTipoInmuebleFilter.parseParam(tipoInmuebleParam);
        if (tipos.isEmpty() || tipos.size() >= DatasetTipoInmuebleFilter.allKeys().size()) {
            return ALL;
        }
        List<String> sorted = new ArrayList<>(tipos);
        Collections.sort(sorted);
        return String.join(",", sorted);
    }

    public static List<String> tiposForKey(String filterKey) {
        if (filterKey == null || ALL.equals(filterKey)) {
            return List.of();
        }
        return List.of(filterKey.split(","));
    }
}
