import { useMemo } from 'react'
import GraficoConsumo from './GraficoConsumo'
import GraficoRealVsPrediccion from './GraficoRealVsPrediccion'
import GraficoPicoValle from './GraficoPicoValle'
import GraficoCostoMensual from './GraficoCostoMensual'
import GraficoVariacionMensual from './GraficoVariacionMensual'
import GraficoBreakdownTipoInmueble from './GraficoBreakdownTipoInmueble'
import ChartSectionFallback from './ChartSectionFallback'
import { DASHBOARD_CHART_SYNC_ID } from '../utils/chartInteractivity'
import {
  DEFAULT_DASHBOARD_FILTERS,
  filterAnalyticsOverview,
  filterConsumos,
  showCostCharts,
  showKwhCharts,
  variationValueKey,
} from '../utils/dashboardChartFilters'

/**
 * Gráficos del dashboard. Consumo (kWh/costo) no dependen de analytics/overview.
 */
export default function DashboardChartsSection({
  consumos,
  analytics,
  analyticsPending = false,
  breakdown,
  breakdownPending = false,
  chartBadgeVariant = 'demo',
  chartFilters = DEFAULT_DASHBOARD_FILTERS,
}) {
  const syncId = DASHBOARD_CHART_SYNC_ID
  const filters = chartFilters ?? DEFAULT_DASHBOARD_FILTERS

  const filteredConsumos = useMemo(
    () => filterConsumos(consumos, filters.period),
    [consumos, filters.period],
  )
  const filteredAnalytics = useMemo(
    () => (analytics ? filterAnalyticsOverview(analytics, filters.period) : null),
    [analytics, filters.period],
  )

  const kwhVisible = showKwhCharts(filters.metric)
  const costVisible = showCostCharts(filters.metric)
  const variationKey = variationValueKey(filters.metric)
  const analyticsReady = (filteredAnalytics?.months?.length ?? 0) > 0

  return (
    <div className="dashboard-charts-section">
      {kwhVisible && (
        <GraficoConsumo
          consumos={filteredConsumos}
          chartBadgeVariant={chartBadgeVariant}
          syncId={syncId}
        />
      )}

      <div className="row g-3 mt-1 align-items-stretch">
        {costVisible && (
          <div className="col-12 col-xl-6 d-flex">
            <GraficoCostoMensual
              consumos={filteredConsumos}
              chartBadgeVariant={chartBadgeVariant}
              syncId={syncId}
            />
          </div>
        )}
        <div className={`col-12 d-flex ${costVisible ? 'col-xl-6' : ''}`}>
          <GraficoVariacionMensual
            consumos={filteredConsumos}
            valueKey={variationKey}
            chartBadgeVariant={chartBadgeVariant}
            syncId={syncId}
          />
        </div>
      </div>

      {kwhVisible &&
        (analyticsReady ? (
          <div className="row g-3 mt-1 align-items-stretch">
            <div className="col-12 col-xl-6 d-flex">
              <GraficoRealVsPrediccion
                analytics={filteredAnalytics}
                chartBadgeVariant={chartBadgeVariant}
                syncId={syncId}
              />
            </div>
            <div className="col-12 col-xl-6 d-flex">
              <GraficoPicoValle
                analytics={filteredAnalytics}
                chartBadgeVariant={chartBadgeVariant}
                syncId={syncId}
              />
            </div>
          </div>
        ) : (
          analyticsPending && (
            <div className="mt-3">
              <ChartSectionFallback />
            </div>
          )
        ))}

      {breakdownPending && !breakdown ? (
        <div className="mt-3">
          <ChartSectionFallback />
        </div>
      ) : (
        <GraficoBreakdownTipoInmueble
          breakdown={breakdown}
          chartBadgeVariant={chartBadgeVariant}
          syncId={syncId}
        />
      )}
    </div>
  )
}
