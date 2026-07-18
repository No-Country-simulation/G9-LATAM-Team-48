import { useLocale } from '../context/LocaleContext'

function EmptyState({ mensaje }) {
  const { t } = useLocale()

  return (
    <div className="text-center text-muted py-5">
      <p className="mb-0">{mensaje || t('states.empty')}</p>
    </div>
  )
}

export default EmptyState
