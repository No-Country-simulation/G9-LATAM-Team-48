import Loader from './Loader'
import ErrorState from './ErrorState'
import { useFetch } from '../hooks/useFetch'
import { getRecomendaciones } from '../services/recomendacionesService'
import { useLocale } from '../context/LocaleContext'
import { useMemo } from 'react'
import { pickOneRandomPerCategory } from '../utils/recommendationSample'
import { recommendationCatalogTitle } from '../utils/recommendationCatalogText'

function Recomendaciones() {
  const { t } = useLocale()
  const { data, loading, error, refetch } = useFetch(getRecomendaciones)

  const destacadas = useMemo(
    () => pickOneRandomPerCategory(data || []),
    [data],
  )

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4>{t('recommendations.title')}</h4>

        {loading && <Loader mensaje={t('states.loadingRecomendaciones')} />}

        {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

        {!loading && !error && (
          <ul className="mb-0">
            {destacadas.map((item) => (
              <li key={item.id}>
                <span className="text-muted small me-1">
                  {t(`recommendations.category.${item.categoryKey}`)}:
                </span>
                {recommendationCatalogTitle(t, item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Recomendaciones
