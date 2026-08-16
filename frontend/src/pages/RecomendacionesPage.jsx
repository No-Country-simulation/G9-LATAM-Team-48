import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getRecomendaciones } from '../services/recomendacionesService'
import { useLocale } from '../context/LocaleContext'
import { useMemo } from 'react'
import { pickOneRandomPerCategory } from '../utils/recommendationSample'
import {
  recommendationCatalogDescription,
  recommendationCatalogTitle,
} from '../utils/recommendationCatalogText'

const priorityClass = {
  high: 'text-bg-danger',
  medium: 'text-bg-warning',
  low: 'text-bg-secondary',
}

function RecomendacionesPage() {
  const { t, locale, dictVersion } = useLocale()
  const { data, loading, error, refetch } = useFetch(getRecomendaciones)

  const recomendaciones = useMemo(
    () => pickOneRandomPerCategory(data || []),
    [data],
  )

  const ahorroTotal = recomendaciones.reduce((sum, item) => {
    return sum + Number(item.ahorro.replace('%', ''))
  }, 0)

  const prioridadAlta = recomendaciones.filter(
    (item) => item.priorityKey === 'high',
  ).length

  return (
    <div className="container-fluid px-0 px-sm-2 page-content">
      <h1 className="mb-2 fs-3 fs-md-2">{t('recommendations.title')}</h1>
      <p className="text-muted mb-4">{t('recommendations.subtitle')}</p>

      {loading && <Loader mensaje={t('states.loadingRecomendaciones')} />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !recomendaciones.length && <EmptyState />}

      {!loading && !error && recomendaciones.length > 0 && (
        <>
          <div className="row mb-4 g-3">
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">{t('recommendations.total')}</h6>
                  <h2>{recomendaciones.length}</h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">
                    {t('recommendations.highPriority')}
                  </h6>
                  <h2>{prioridadAlta}</h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">
                    {t('recommendations.potentialSavings')}
                  </h6>
                  <h2>{ahorroTotal}%</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {recomendaciones.map((item) => (
              <div className="col-12 col-lg-6" key={`${item.id}-${dictVersion}-${locale}`}>
                <div className="card shadow h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge text-bg-primary">
                        {t(`recommendations.category.${item.categoryKey}`)}
                      </span>
                      <span
                        className={`badge ${priorityClass[item.priorityKey]}`}
                      >
                        {t(`recommendations.priority.${item.priorityKey}`)}
                      </span>
                    </div>

                    <h5>{recommendationCatalogTitle(t, item, locale)}</h5>
                    <p className="text-muted mb-3">
                      {recommendationCatalogDescription(t, item, locale)}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {t('recommendations.estimatedSavings')}
                      </small>
                      <strong className="text-success">{item.ahorro}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RecomendacionesPage
