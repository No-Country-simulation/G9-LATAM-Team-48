import { useLocale } from '../context/LocaleContext'

/** Badge: dataset agregado DS o fallback demo local (no análisis del usuario). */
function DemoSampleBadge({ className = '', variant = 'demo' }) {
  const { t } = useLocale()
  const isDataset = variant === 'dataset'

  if (isDataset) {
    return (
      <span
        className={`badge text-bg-info fw-normal align-middle ${className}`.trim()}
        title={t('dashboard.datasetSampleHint')}
      >
        {t('dashboard.datasetSample')}
      </span>
    )
  }

  return (
    <span
      className={`badge text-bg-secondary fw-normal align-middle ${className}`.trim()}
      title={t('dashboard.demoSampleHint')}
    >
      {t('dashboard.demoSample')}
    </span>
  )
}

export default DemoSampleBadge
