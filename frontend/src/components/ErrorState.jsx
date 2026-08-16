import { useLocale } from '../context/LocaleContext'

function ErrorState({ mensaje, onRetry }) {
  const { t } = useLocale()

  return (
    <div
      className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
      role="alert"
    >
      <span>{mensaje || t('states.error')}</span>

      {onRetry && (
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={onRetry}
        >
          {t('states.retry')}
        </button>
      )}
    </div>
  )
}

export default ErrorState
