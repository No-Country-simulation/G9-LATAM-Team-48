import { useLocale } from '../context/LocaleContext'

function Loader({ mensaje }) {
  const { t } = useLocale()
  const text = mensaje || t('states.loading')

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">{t('states.loading')}</span>
      </div>
      <span>{text}</span>
    </div>
  )
}

export default Loader
