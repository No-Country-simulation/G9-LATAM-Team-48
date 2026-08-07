import GraficoConsumo from './GraficoConsumo'
import GraficoRealVsPrediccion from './GraficoRealVsPrediccion'
import GraficoPicoValle from './GraficoPicoValle'

/** Bloque Recharts del dashboard (import estático: evita chunk lazy desactualizado en CDN). */
export default function DashboardChartsSection({ consumos, analytics, chartBadgeVariant = 'demo' }) {
  return (
    <>
      <GraficoConsumo consumos={consumos} chartBadgeVariant={chartBadgeVariant} />

      <div className="row g-3 mt-1 align-items-stretch">
        <div className="col-12 col-xl-6 d-flex">
          <GraficoRealVsPrediccion analytics={analytics} chartBadgeVariant={chartBadgeVariant} />
        </div>
        <div className="col-12 col-xl-6 d-flex">
          <GraficoPicoValle analytics={analytics} chartBadgeVariant={chartBadgeVariant} />
        </div>
      </div>
    </>
  )
}
