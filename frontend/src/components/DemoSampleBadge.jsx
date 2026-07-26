import { useLocale } from '../context/LocaleContext'

/** Badge para datos de demostración (mock) hasta que llegue el ML real. */
function DemoSampleBadge({ className = '' }) {
  const { t } = useLocale()

  return (
    <span
      className={`badge text-bg-secondary fw-normal align-middle ${className}`.trim()}
      title={t(
        'dashboard.demoSampleHint',
        'Datos de ejemplo para la demo. No provienen de tus análisis reales.',
      )}
    >
      {t('dashboard.demoSample', 'Ejemplo')}
    </span>
  )
}

export default DemoSampleBadge
