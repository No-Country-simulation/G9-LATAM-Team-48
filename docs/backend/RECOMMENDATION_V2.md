# Motor de Recomendaciones — integración SHAP (prod OCI)

> Estado **agosto 2026** tras cherry-pick selectivo del PR #23 (`7485b434`).  
> Complementa [`RECOMMENDATION.md`](./RECOMMENDATION.md) (motor Strategy + catálogo Flyway).

---

## Qué se integró (desde V2)

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| `AnalisisFeatureCalculator` | `analisis.service` | Métricas derivadas: consumo/persona, factor aislamiento, proporción LED |
| `AnalisisTipsComposer` | `analisis.service` | Enriquece `RecommendationRequest` antes de `generate()` |
| `HighOccupantConsumptionRule` | `recommendation.rules` | Tip `occupancy` → catálogo `HIGH_CONSUMPTION_PER_PERSON` |
| `InsulationFromFormRule` / `LedUpgradeRule` | `recommendation.rules` | Formulario **o** métrica calculada si falta el campo |
| `CalculationProperties` | `config` | Umbrales tunables (`APP_CALCULATION_*`) — sustituye `CalculationConstants` del V2 |
| `UserRecommendationSyncService` | `recommendation.service` | Antiduplicados ACTIVE en BD (equivalente funcional al `RecommendationHistoryService` del V2) |
| Tests | `src/test/...` | `AnalisisTipsComposerTest`, `UserRecommendationSyncAntiduplicateTest` |

---

## Qué **no** se integró (y por qué)

| Del PR #23 | Motivo |
|------------|--------|
| `generateRecommendations()` + DTOs builder | Rompe contrato actual (`generate()` + tipKeys cortas) |
| Entidades `model/` duplicadas | Conflicto con `persistence/` + Flyway V10–V11 ya en prod |
| Eliminación de rollups V12 / cache dashboard | Regresión de performance (~150 ms → segundos) |
| Menos reglas (borrar AC, peak, etc.) | Pérdida de personalización ya desplegada |
| `RecommendationCliRunner` | Nice-to-have; no bloquea prod |

Historial completo del V2: `git show 7485b434`.

---

## Flujo en producción

```text
POST /api/analisis
  → ML (Render) → nivelKey
  → AnalisisFeatureCalculator (métricas SHAP)
  → RecommendationServiceImpl.generate() → tipKeys
  → UserRecommendationSyncService (JWT) → user_recommendations
  → GET /api/recomendaciones (catálogo V11, 33 tip_key)
```

---

## Catálogo ampliado — Fase 1 (Flyway V14)

| Cambio | Detalle |
|--------|---------|
| Columnas | `nivel` (`efficient` \| `moderate` \| `inefficient`; NULL = todos) y `category_key` (`climate`, `lighting`, …) |
| Backfill | Las 33 filas V11 reciben `category_key`; perfiles base reciben `nivel` explícito |
| Piloto moderado | **63** tips (`*_MOD_*`, V14–V15) |
| Niveles efficient / inefficient | **120** tips V16 (`*_EFF_*` / `*_INEFF_*`, 12 × 5 dominios) |
| API | `GET /api/recomendaciones?nivel=efficient&domain=climate` (etc.) |
| i18n front | `PILOT_CATALOG_KEYS` + `npm run build:catalog` (es/en; resto fallback a en) |

**Próximas fases:** escalar tips; artefactos DS v3 + SHAP en [`DATASCIENCE_V3_ARTEFACTOS.md`](./DATASCIENCE_V3_ARTEFACTOS.md).

---

## Umbrales (Data Science)

Configuración en `application.yml` → `app.calculation`. Override en OCI:

```bash
APP_CALCULATION_DEFAULT_CONSUMPTION_PER_PERSON=150.0   # umbral occupancy
APP_CALCULATION_INSULATION_FACTOR_POOR=1.3             # Malo (SHAP v3)
APP_CALCULATION_INSULATION_FACTOR_FAIR=1.0             # Regular
APP_CALCULATION_INSULATION_FACTOR_GOOD=0.7             # Bueno
```

Ver `backend/.env.example` para la lista completa.

---

## Verificación

```bash
cd backend && mvn clean test
# Smoke prod (OCI):
# ENERGY_API_URL=http://163.176.248.56:8080 .\qa\smoke-api.ps1
```
