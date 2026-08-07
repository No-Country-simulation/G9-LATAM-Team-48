import { useLocale } from '../context/LocaleContext'

/** Badge cuando los gráficos usan mock o dataset agregado de DS (no análisis del usuario). */
function DemoSampleBadge({ className = '', variant = 'demo' }) {
  const { t } = useLocale()
  const isDataset = variant === 'dataset'

  return (
    <span
      className={`badge text-bg-secondary fw-normal align-middle ${className}`.trim()}
      title={t(
        isDataset ? 'dashboard.datasetSampleHint' : 'dashboard.demoSampleHint',
        isDataset
          ? 'Promedios agregados del dataset de feature engineering (Data Science).'
          : 'Datos de ejemplo para la demo.',
      )}
    >
      {t(
        isDataset ? 'dashboard.datasetSample' : 'dashboard.demoSample',
        isDataset ? 'Dataset DS' : 'Ejemplo',
      )}
    </span>
  )
}

export default DemoSampleBadge
