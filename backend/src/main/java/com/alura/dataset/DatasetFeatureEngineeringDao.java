package com.alura.dataset;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class DatasetFeatureEngineeringDao {

    private final JdbcTemplate jdbcTemplate;
    private volatile Boolean rollupsReady;

    public DatasetFeatureEngineeringDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean hasRows() {
        // Preferir rollups del dashboard si existen (arranque / health del dataset).
        try {
            Integer rollup = jdbcTemplate.queryForObject(
                    "SELECT 1 FROM dataset_dashboard_monthly LIMIT 1", Integer.class);
            if (rollup != null) {
                return true;
            }
        } catch (DataAccessException ignored) {
            // tabla ausente o vacía → seguir con dataset crudo
        }

        try {
            Integer one = jdbcTemplate.queryForObject(
                    "SELECT 1 FROM dataset_feature_engineering LIMIT 1", Integer.class);
            return one != null;
        } catch (DataAccessException ex) {
            return false;
        }
    }

    private boolean useRollups() {
        if (rollupsReady != null) {
            return rollupsReady;
        }
        synchronized (this) {
            if (rollupsReady != null) {
                return rollupsReady;
            }
            try {
                // LIMIT 1 evita COUNT(*) sobre tablas grandes en cada cold-check.
                Integer one = jdbcTemplate.queryForObject(
                        "SELECT 1 FROM dataset_dashboard_monthly LIMIT 1", Integer.class);
                rollupsReady = one != null;
            } catch (DataAccessException ex) {
                rollupsReady = false;
            }
            return rollupsReady;
        }
    }

    /** Llamado tras generar rollups en el arranque. */
    public void markRollupsReady() {
        rollupsReady = true;
    }

    /**
     * Promedio de kWh y costo estimado (USD ~ 0.75 USD/kWh) por mes calendario ({@code mes_numero}).
     */
    public List<Map<String, Object>> avgConsumoByMesNumero(String tipoInmuebleParam) {
        if (useRollups()) {
            return monthlyRollupRows(tipoInmuebleParam, "avg_consumo_kwh", "avg_costo_usd");
        }
        return avgConsumoByMesNumeroLegacy(tipoInmuebleParam);
    }

    /**
     * Serie para gráfico real vs tendencia (mes anterior como proxy de predicción del modelo).
     */
    public List<Map<String, Object>> avgActualVsAnteriorByMesNumero(String tipoInmuebleParam) {
        if (useRollups()) {
            String filterKey = DatasetFilterKey.fromParam(tipoInmuebleParam);
            String sql =
                    """
                    SELECT mes_numero,
                           avg_actual_kwh AS actual_kwh,
                           avg_predicted_kwh AS predicted_kwh
                    FROM dataset_dashboard_monthly
                    WHERE filter_key = ?
                      AND avg_actual_kwh IS NOT NULL
                      AND avg_predicted_kwh IS NOT NULL
                    ORDER BY mes_numero
                    """;
            return jdbcTemplate.queryForList(sql, filterKey);
        }
        return avgActualVsAnteriorByMesNumeroLegacy(tipoInmuebleParam);
    }

    /**
     * Reparto pico / valle usando proporciones del dataset (diurno vs nocturno).
     */
    public List<Map<String, Object>> avgPeakOffPeakByMesNumero(String tipoInmuebleParam) {
        if (useRollups()) {
            String filterKey = DatasetFilterKey.fromParam(tipoInmuebleParam);
            String sql =
                    """
                    SELECT mes_numero,
                           avg_peak_kwh AS peak_kwh,
                           avg_off_peak_kwh AS off_peak_kwh
                    FROM dataset_dashboard_monthly
                    WHERE filter_key = ?
                    ORDER BY mes_numero
                    """;
            return jdbcTemplate.queryForList(sql, filterKey);
        }
        return avgPeakOffPeakByMesNumeroLegacy(tipoInmuebleParam);
    }

    public Optional<String> dominantPerfilEnergetico() {
        if (useRollups()) {
            return metaString(DatasetFilterKey.ALL, "dominant_perfil");
        }
        return dominantPerfilEnergeticoLegacy();
    }

    public Optional<Double> avgCalidadRegistro() {
        if (useRollups()) {
            return metaDouble(DatasetFilterKey.ALL, "avg_calidad");
        }
        return avgCalidadRegistroLegacy();
    }

    /**
     * Promedio de kWh por tipo de inmueble (one-hot del dataset). {@code mesNumeros} vacío = sin filtro de mes.
     */
    public List<Map<String, Object>> avgConsumoByTipoInmueble(List<Integer> mesNumeros, String tipoInmuebleParam) {
        if (useRollups()) {
            return breakdownFromRollup(mesNumeros, tipoInmuebleParam);
        }
        return avgConsumoByTipoInmuebleLegacy(mesNumeros, tipoInmuebleParam);
    }

    private List<Map<String, Object>> monthlyRollupRows(
            String tipoInmuebleParam, String consumoColumn, String costoColumn) {
        String filterKey = DatasetFilterKey.fromParam(tipoInmuebleParam);
        String sql =
                """
                SELECT mes_numero,
                       %s AS consumo,
                       %s AS costo
                FROM dataset_dashboard_monthly
                WHERE filter_key = ?
                ORDER BY mes_numero
                """
                        .formatted(consumoColumn, costoColumn);
        return jdbcTemplate.queryForList(sql, filterKey);
    }

    private List<Map<String, Object>> breakdownFromRollup(
            List<Integer> mesNumeros, String tipoInmuebleParam) {
        String filterKey = DatasetFilterKey.fromParam(tipoInmuebleParam);
        StringBuilder sql =
                new StringBuilder(
                        """
                        SELECT segment,
                               SUM(avg_kwh * sample_count) / NULLIF(SUM(sample_count), 0) AS avg_kwh,
                               SUM(sample_count) AS samples
                        FROM dataset_dashboard_breakdown
                        WHERE filter_key = ?
                        """);
        List<Object> params = new ArrayList<>();
        params.add(filterKey);
        if (mesNumeros != null && !mesNumeros.isEmpty()) {
            sql.append(" AND mes_numero IN (");
            sql.append(String.join(",", mesNumeros.stream().map(m -> "?").toList()));
            sql.append(") ");
            params.addAll(mesNumeros);
        }
        sql.append(" GROUP BY segment ORDER BY avg_kwh DESC");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    private Optional<String> metaString(String filterKey, String column) {
        try {
            return Optional.ofNullable(
                    jdbcTemplate.queryForObject(
                            "SELECT " + column + " FROM dataset_dashboard_meta WHERE filter_key = ?",
                            String.class,
                            filterKey));
        } catch (DataAccessException ex) {
            return Optional.empty();
        }
    }

    private Optional<Double> metaDouble(String filterKey, String column) {
        try {
            return Optional.ofNullable(
                    jdbcTemplate.queryForObject(
                            "SELECT " + column + " FROM dataset_dashboard_meta WHERE filter_key = ?",
                            Double.class,
                            filterKey));
        } catch (DataAccessException ex) {
            return Optional.empty();
        }
    }

    private List<Map<String, Object>> avgConsumoByMesNumeroLegacy(String tipoInmuebleParam) {
        String tipoClause = DatasetTipoInmuebleFilter.sqlOrClause(DatasetTipoInmuebleFilter.parseParam(tipoInmuebleParam));
        String sql =
                """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual) AS consumo,
                       AVG(consumo_kwh_mensual) * 0.75 AS costo
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                %s
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """
                        .formatted(tipoClause);
        return jdbcTemplate.queryForList(sql);
    }

    private List<Map<String, Object>> avgActualVsAnteriorByMesNumeroLegacy(String tipoInmuebleParam) {
        String tipoClause = DatasetTipoInmuebleFilter.sqlOrClause(DatasetTipoInmuebleFilter.parseParam(tipoInmuebleParam));
        String sql =
                """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual) AS actual_kwh,
                       AVG(consumo_kwh_mes_anterior) AS predicted_kwh
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND consumo_kwh_mes_anterior IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                %s
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """
                        .formatted(tipoClause);
        return jdbcTemplate.queryForList(sql);
    }

    private List<Map<String, Object>> avgPeakOffPeakByMesNumeroLegacy(String tipoInmuebleParam) {
        String tipoClause = DatasetTipoInmuebleFilter.sqlOrClause(DatasetTipoInmuebleFilter.parseParam(tipoInmuebleParam));
        String sql =
                """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual * COALESCE(NULLIF(pico_uso_diurno, 0), 0.35)) AS peak_kwh,
                       AVG(consumo_kwh_mensual * COALESCE(NULLIF(pico_uso_nocturno, 0), 0.65)) AS off_peak_kwh
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                %s
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """
                        .formatted(tipoClause);
        return jdbcTemplate.queryForList(sql);
    }

    private Optional<String> dominantPerfilEnergeticoLegacy() {
        try {
            String sql =
                    """
                    SELECT perfil_energetico
                    FROM dataset_feature_engineering
                    WHERE perfil_energetico IS NOT NULL AND TRIM(perfil_energetico) <> ''
                    GROUP BY perfil_energetico
                    ORDER BY COUNT(*) DESC
                    LIMIT 1
                    """;
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, String.class));
        } catch (DataAccessException ex) {
            return Optional.empty();
        }
    }

    private Optional<Double> avgCalidadRegistroLegacy() {
        try {
            Double value =
                    jdbcTemplate.queryForObject(
                            """
                            SELECT AVG(indice_calidad_registro)
                            FROM dataset_feature_engineering
                            WHERE indice_calidad_registro IS NOT NULL
                            """,
                            Double.class);
            return Optional.ofNullable(value);
        } catch (DataAccessException ex) {
            return Optional.empty();
        }
    }

    private List<Map<String, Object>> avgConsumoByTipoInmuebleLegacy(
            List<Integer> mesNumeros, String tipoInmuebleParam) {
        String mesClause = "";
        if (mesNumeros != null && !mesNumeros.isEmpty()) {
            String inList = mesNumeros.stream().map(String::valueOf).reduce((a, b) -> a + "," + b).orElse("");
            mesClause = " AND mes_numero IN (" + inList + ") ";
        }
        String tipoClause = DatasetTipoInmuebleFilter.sqlOrClause(DatasetTipoInmuebleFilter.parseParam(tipoInmuebleParam));
        String sql =
                """
                SELECT segment, AVG(consumo_kwh_mensual) AS avg_kwh, COUNT(*) AS samples
                FROM (
                    SELECT consumo_kwh_mensual,
                           CASE
                               WHEN COALESCE(tipo_inmueble_apartamento, 0)
                                    >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                                AND COALESCE(tipo_inmueble_apartamento, 0)
                                    >= COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                                AND COALESCE(tipo_inmueble_apartamento, 0) > 0
                                   THEN 'Apartamento'
                               WHEN COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                                    >= COALESCE(tipo_inmueble_casa_unifamiliar, 0)
                                AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0)
                                    >= COALESCE(tipo_inmueble_apartamento, 0)
                                AND COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0) > 0
                                   THEN 'Pequeño Establecimiento Comercial'
                               ELSE 'Casa Unifamiliar'
                           END AS segment
                    FROM dataset_feature_engineering
                    WHERE consumo_kwh_mensual IS NOT NULL
                    %s
                    %s
                ) typed
                GROUP BY segment
                ORDER BY avg_kwh DESC
                """
                        .formatted(mesClause, tipoClause);
        return jdbcTemplate.queryForList(sql);
    }
}
