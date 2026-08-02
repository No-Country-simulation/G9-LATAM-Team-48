import GraficoConsumo from './GraficoConsumo'
import GraficoRealVsPrediccion from './GraficoRealVsPrediccion'
import GraficoPicoValle from './GraficoPicoValle'

/** Bloque con Recharts — un solo import dinámico desde Dashboard (mobile / LCP). */
export default function DashboardChartsSection({ consumos }) {
  return (
    <>
      <GraficoConsumo consumos={consumos} />

      <div className="row g-3 mt-1 align-items-stretch">
        <div className="col-12 col-xl-6 d-flex">
          <GraficoRealVsPrediccion />
        </div>
        <div className="col-12 col-xl-6 d-flex">
          <GraficoPicoValle />
        </div>
      </div>
    </>
  )
}
