import { lazy, Suspense } from 'react'
import ChartSectionFallback from './ChartSectionFallback'

const DashboardChartsSection = lazy(() => import('./DashboardChartsSection'))

/** Carga Recharts bajo demanda (chunk aparte del bundle inicial). */
export default function DashboardChartsLazy(props) {
  return (
    <Suspense fallback={<ChartSectionFallback />}>
      <DashboardChartsSection {...props} />
    </Suspense>
  )
}
