import { useLocale } from '../context/LocaleContext'

function EmptyState({ mensaje, actionLabel, onAction }) {
  const { t } = useLocale()

  return (
    <div className="text-center text-muted py-5 px-3">
      <p className="mb-0">{mensaje || t('states.empty')}</p>
      {actionLabel && typeof onAction === 'function' && (
        <button
          type="button"
          className="btn btn-primary btn-sm mt-3"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
