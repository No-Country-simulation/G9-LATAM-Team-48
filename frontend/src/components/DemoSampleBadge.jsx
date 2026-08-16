import { useLocale } from '../context/LocaleContext'

/** Badge opcional solo para serie demo local (no datos reales en API). */
function DemoSampleBadge({ className = '', variant = 'demo' }) {
  const { t } = useLocale()

  if (variant !== 'demo') {
    return null
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
