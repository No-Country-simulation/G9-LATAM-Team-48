package com.alura.dataset;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class DatasetFeatureEngineeringDao {

    private final JdbcTemplate jdbcTemplate;

    public DatasetFeatureEngineeringDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean hasRows() {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM dataset_feature_engineering", Integer.class);
            return count != null && count > 0;
        } catch (DataAccessException ex) {
            return false;
        }
    }

    /**
     * Promedio de kWh y costo estimado (USD ~ 0.75 USD/kWh) por mes calendario ({@code mes_numero}).
     */
    public List<Map<String, Object>> avgConsumoByMesNumero() {
        String sql = """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual) AS consumo,
                       AVG(consumo_kwh_mensual) * 0.75 AS costo
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Serie para gráfico real vs tendencia (mes anterior como proxy de predicción del modelo).
     */
    public List<Map<String, Object>> avgActualVsAnteriorByMesNumero() {
        String sql = """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual) AS actual_kwh,
                       AVG(consumo_kwh_mes_anterior) AS predicted_kwh
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND consumo_kwh_mes_anterior IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Reparto pico / valle usando proporciones del dataset (diurno vs nocturno).
     */
    public List<Map<String, Object>> avgPeakOffPeakByMesNumero() {
        String sql = """
                SELECT ROUND(mes_numero) AS mes_numero,
                       AVG(consumo_kwh_mensual * COALESCE(NULLIF(pico_uso_diurno, 0), 0.35)) AS peak_kwh,
                       AVG(consumo_kwh_mensual * COALESCE(NULLIF(pico_uso_nocturno, 0), 0.65)) AS off_peak_kwh
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                GROUP BY ROUND(mes_numero)
                ORDER BY mes_numero
                """;
        return jdbcTemplate.queryForList(sql);
    }

    public Optional<String> dominantPerfilEnergetico() {
        try {
            String sql = """
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

    public Optional<Double> avgCalidadRegistro() {
        try {
            Double value = jdbcTemplate.queryForObject(
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
}
