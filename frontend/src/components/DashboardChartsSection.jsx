import { useEffect, useMemo, useState } from 'react'
import GraficoConsumo from './GraficoConsumo'
import GraficoRealVsPrediccion from './GraficoRealVsPrediccion'
import GraficoPicoValle from './GraficoPicoValle'
import GraficoCostoMensual from './GraficoCostoMensual'
import GraficoVariacionMensual from './GraficoVariacionMensual'
import GraficoBreakdownTipoInmueble from './GraficoBreakdownTipoInmueble'
import { DASHBOARD_CHART_SYNC_ID } from '../utils/chartInteractivity'
import {
  DEFAULT_DASHBOARD_FILTERS,
  filterAnalyticsOverview,
  filterConsumos,
  monthKeysFromConsumos,
  normalizeTiposInmueble,
  showCostCharts,
  showKwhCharts,
  tiposInmuebleFetchKey,
  variationValueKey,
} from '../utils/dashboardChartFilters'
import { getAnalyticsBreakdown } from '../services/analyticsService'

/** Bloque Recharts del dashboard (import estático: evita chunk lazy desactualizado en CDN). */
export default function DashboardChartsSection({
  consumos,
  analytics,
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
    () => filterAnalyticsOverview(analytics, filters.period),
    [analytics, filters.period],
  )
  const monthKeys = useMemo(
    () => monthKeysFromConsumos(filteredConsumos),
    [filteredConsumos],
  )

  const [breakdown, setBreakdown] = useState(null)

  const tiposBreakdownKey = tiposInmuebleFetchKey(filters)

  useEffect(() => {
    let cancelled = false
    getAnalyticsBreakdown(monthKeys, {
      tiposInmueble: normalizeTiposInmueble(filters.tiposInmueble),
    })
      .then((data) => {
        if (!cancelled) setBreakdown(data)
      })
      .catch(() => {
        if (!cancelled) setBreakdown(null)
      })
    return () => {
      cancelled = true
    }
  }, [monthKeys.join(','), tiposBreakdownKey])

  const kwhVisible = showKwhCharts(filters.metric)
  const costVisible = showCostCharts(filters.metric)
  const variationKey = variationValueKey(filters.metric)

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

      {kwhVisible && (
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
      )}

      <GraficoBreakdownTipoInmueble
        breakdown={breakdown}
        chartBadgeVariant={chartBadgeVariant}
        syncId={syncId}
      />
    </div>
  )
}
