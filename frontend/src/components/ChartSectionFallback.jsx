import { useLocale } from '../context/LocaleContext'

/** Placeholder ligero mientras carga Recharts (mejor TBT en móvil). */
function ChartSectionFallback() {
  const { t } = useLocale()
  return (
    <div
      className="d-flex align-items-center justify-content-center text-muted border rounded-3 bg-body-secondary bg-opacity-25"
      style={{ minHeight: 260 }}
      aria-busy="true"
    >
      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
        <span className="visually-hidden">{t('states.loading')}</span>
      </div>
      <span className="small">{t('states.loadingChart', 'Cargando gráfico…')}</span>
    </div>
  )
}

export default ChartSectionFallback
