package com.alura.dataset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Pre-agrega el dataset inmutable en tablas chicas (1 scan) para gráficos del dashboard.
 */
@Component
public class DatasetDashboardRollupInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatasetDashboardRollupInitializer.class);

    private final JdbcTemplate jdbcTemplate;
    private final DatasetFeatureEngineeringDao datasetDao;

    public DatasetDashboardRollupInitializer(
            JdbcTemplate jdbcTemplate, DatasetFeatureEngineeringDao datasetDao) {
        this.jdbcTemplate = jdbcTemplate;
        this.datasetDao = datasetDao;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!hasSourceRows()) {
            return;
        }
        if (rollupsAlreadyBuilt()) {
            log.info("Dashboard rollups ya presentes; se omite pre-agregación.");
            datasetDao.markRollupsReady();
            return;
        }
        long started = System.currentTimeMillis();
        buildRollups();
        datasetDao.markRollupsReady();
        log.info("Dashboard rollups generados en {} ms", System.currentTimeMillis() - started);
    }

    boolean rollupsAlreadyBuilt() {
        try {
            Long count =
                    jdbcTemplate.queryForObject("SELECT COUNT(*) FROM dataset_dashboard_monthly", Long.class);
            return count != null && count > 0;
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean hasSourceRows() {
        try {
            Integer one = jdbcTemplate.queryForObject(
                    "SELECT 1 FROM dataset_feature_engineering LIMIT 1", Integer.class);
            return one != null;
        } catch (Exception ex) {
            return false;
        }
    }

    private void buildRollups() {
        String sql =
                """
                SELECT ROUND(mes_numero) AS mes_numero,
                       consumo_kwh_mensual,
                       consumo_kwh_mes_anterior,
                       pico_uso_diurno,
                       pico_uso_nocturno,
                       COALESCE(tipo_inmueble_apartamento, 0) AS apt,
                       COALESCE(tipo_inmueble_casa_unifamiliar, 0) AS casa,
                       COALESCE(tipo_inmueble_pequeno_establecimiento_comercial, 0) AS comercial,
                       perfil_energetico,
                       indice_calidad_registro
                FROM dataset_feature_engineering
                WHERE mes_numero IS NOT NULL
                  AND consumo_kwh_mensual IS NOT NULL
                  AND mes_numero BETWEEN 1 AND 12
                """;

        Map<String, Map<Integer, MonthlyAgg>> monthly = new HashMap<>();
        Map<String, Map<Integer, Map<String, BreakdownAgg>>> breakdown = new HashMap<>();
        Map<String, Map<String, Long>> perfilCounts = new HashMap<>();
        Map<String, CalidadAgg> calidad = new HashMap<>();

        for (String filterKey : DatasetFilterKey.ROLLUP_KEYS) {
            monthly.put(filterKey, new HashMap<>());
            breakdown.put(filterKey, new HashMap<>());
            perfilCounts.put(filterKey, new HashMap<>());
            calidad.put(filterKey, new CalidadAgg());
        }

        jdbcTemplate.query(sql, rs -> {
            int mes = rs.getInt("mes_numero");
            double consumo = rs.getDouble("consumo_kwh_mensual");
            Double mesAnteriorObj = (Double) rs.getObject("consumo_kwh_mes_anterior");
            boolean hasAnterior = mesAnteriorObj != null && mesAnteriorObj > 0;
            double mesAnterior = hasAnterior ? mesAnteriorObj : 0;
            double diurno = rs.getDouble("pico_uso_diurno");
            double nocturno = rs.getDouble("pico_uso_nocturno");
            double apt = rs.getDouble("apt");
            double casa = rs.getDouble("casa");
            double comercial = rs.getDouble("comercial");
            String perfil = rs.getString("perfil_energetico");
            Double calidadObj = (Double) rs.getObject("indice_calidad_registro");
            double peakRatio = diurno > 0 ? diurno : 0.35;
            double offPeakRatio = nocturno > 0 ? nocturno : 0.65;
            String segment = DatasetTipoInmuebleFilter.segmentLabel(apt, casa, comercial);

            for (String filterKey : DatasetFilterKey.ROLLUP_KEYS) {
                List<String> tipos = DatasetFilterKey.tiposForKey(filterKey);
                if (!DatasetTipoInmuebleFilter.rowMatchesFilter(tipos, apt, casa, comercial)) {
                    continue;
                }
                monthly.get(filterKey).computeIfAbsent(mes, k -> new MonthlyAgg()).add(
                        consumo, mesAnterior, hasAnterior, peakRatio, offPeakRatio);
                breakdown
                        .get(filterKey)
                        .computeIfAbsent(mes, k -> new HashMap<>())
                        .computeIfAbsent(segment, k -> new BreakdownAgg())
                        .add(consumo);
                if (perfil != null && !perfil.isBlank()) {
                    perfilCounts
                            .get(filterKey)
                            .merge(perfil.trim(), 1L, Long::sum);
                }
                if (calidadObj != null && calidadObj > 0) {
                    calidad.get(filterKey).add(calidadObj);
                }
            }
        });

        insertMonthly(monthly);
        insertBreakdown(breakdown);
        insertMeta(perfilCounts, calidad);
    }

    private void insertMonthly(Map<String, Map<Integer, MonthlyAgg>> monthly) {
        jdbcTemplate.batchUpdate(
                """
                INSERT INTO dataset_dashboard_monthly
                (filter_key, mes_numero, avg_consumo_kwh, avg_costo_usd, avg_actual_kwh, avg_predicted_kwh,
                 avg_peak_kwh, avg_off_peak_kwh, sample_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                monthly.entrySet().stream()
                        .flatMap(e -> e.getValue().entrySet().stream()
                                .map(me -> new Object[] {
                                    e.getKey(),
                                    me.getKey(),
                                    me.getValue().avgConsumo(),
                                    me.getValue().avgConsumo() * 0.75,
                                    me.getValue().avgConsumo(),
                                    me.getValue().avgPredicted(),
                                    me.getValue().avgPeak(),
                                    me.getValue().avgOffPeak(),
                                    me.getValue().count
                                }))
                        .toList());
    }

    private void insertBreakdown(Map<String, Map<Integer, Map<String, BreakdownAgg>>> breakdown) {
        jdbcTemplate.batchUpdate(
                """
                INSERT INTO dataset_dashboard_breakdown
                (filter_key, mes_numero, segment, avg_kwh, sample_count)
                VALUES (?, ?, ?, ?, ?)
                """,
                breakdown.entrySet().stream()
                        .flatMap(e -> e.getValue().entrySet().stream()
                                .flatMap(me -> me.getValue().entrySet().stream()
                                        .map(seg -> new Object[] {
                                            e.getKey(),
                                            me.getKey(),
                                            seg.getKey(),
                                            seg.getValue().avg(),
                                            seg.getValue().count
                                        })))
                        .toList());
    }

    private void insertMeta(Map<String, Map<String, Long>> perfilCounts, Map<String, CalidadAgg> calidad) {
        jdbcTemplate.batchUpdate(
                """
                INSERT INTO dataset_dashboard_meta (filter_key, dominant_perfil, avg_calidad)
                VALUES (?, ?, ?)
                """,
                DatasetFilterKey.ROLLUP_KEYS.stream()
                        .map(key -> new Object[] {
                            key,
                            dominantPerfil(perfilCounts.get(key)),
                            calidad.get(key).avg()
                        })
                        .toList());
    }

    private static String dominantPerfil(Map<String, Long> counts) {
        if (counts == null || counts.isEmpty()) {
            return null;
        }
        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private static final class MonthlyAgg {
        double sumConsumo;
        double sumPredicted;
        long predictedCount;
        double sumPeak;
        double sumOffPeak;
        long count;

        void add(double consumo, double mesAnterior, boolean hasAnterior, double peakRatio, double offPeakRatio) {
            sumConsumo += consumo;
            if (hasAnterior) {
                sumPredicted += mesAnterior;
                predictedCount++;
            }
            sumPeak += consumo * peakRatio;
            sumOffPeak += consumo * offPeakRatio;
            count++;
        }

        double avgConsumo() {
            return count == 0 ? 0 : sumConsumo / count;
        }

        double avgPredicted() {
            return predictedCount == 0 ? avgConsumo() : sumPredicted / predictedCount;
        }

        double avgPeak() {
            return count == 0 ? 0 : sumPeak / count;
        }

        double avgOffPeak() {
            return count == 0 ? 0 : sumOffPeak / count;
        }
    }

    private static final class BreakdownAgg {
        double sum;
        long count;

        void add(double consumo) {
            sum += consumo;
            count++;
        }

        double avg() {
            return count == 0 ? 0 : sum / count;
        }
    }

    private static final class CalidadAgg {
        double sum;
        long count;

        void add(double value) {
            sum += value;
            count++;
        }

        Double avg() {
            return count == 0 ? null : sum / count;
        }
    }
}
