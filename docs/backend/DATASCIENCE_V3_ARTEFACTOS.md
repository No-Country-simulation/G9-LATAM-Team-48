# Integración artefactos Data Science v3 (ago 2026)

Fuente: rama GitHub `datascience` (sin merge completo — historial distinto).

## Qué se trajo a `Jorge-martinez`

| Ruta local | Contenido |
|------------|-----------|
| `datascience/models/*v3*` | Trio joblib + metadata (F1 macro 0.91) |
| `datascience/reports/model_interpretation/` | Ranking SHAP, waterfalls, validación reglas |
| `datascience/docs/especificacion-formulario-modelo.md` | Contrato 12 features |
| `datascience/src/features/feature_engineer_v3.py` | FE del pipeline |
| `docs/backend/especificacion-formulario-modelo.md` | Copia para el equipo backend |

## Mapeo de nombres

| Export DS | Canon ml-service / Render |
|-----------|---------------------------|
| `model_pipeline_v3.joblib` | `modelo_perfil_energetico_final_v3.joblib` (copia idéntica) |

`ml-service/app/v3_bundle.py` acepta **ambos** nombres al resolver el bundle.

## SHAP → recomendaciones / umbrales

Reglas validadas (`validacion_reglas_negocio.csv`) alineadas a categorías del catálogo:

| Señal SHAP | category_key / tip |
|------------|-------------------|
| `consumo_anterior_por_persona` (#1) | `occupancy` |
| `factor_aislamiento` (#4) | `insulation` / climate |
| `proporcion_iluminacion_led` (#6) | `lighting` |
| `equipos_*` (#7/#13) | `equipment` |
| `horas_aa_*` (#8/#15, señal débil) | `climate` |

Defaults `app.calculation.insulation-factor-*` en `application.yml` alineados a clusters SHAP: **Bueno=0.7 / Regular=1.0 / Malo=1.3**.

## Cómo usar en local (sin tocar OCI)

```powershell
.\ml-service\scripts\copy-v3-models.ps1
# Requiere scikit-learn >= 1.6 (ideal 1.9.x como el export DS)
pip install -r ml-service/requirements.txt
```

Smoke: `schema=v3_bundle`, predict de ejemplo → `nivelKey` Eficiente/Moderado/Ineficiente.

**Importante:** el `model_pipeline_v3.joblib` incluye `FeatureEngineerV3` (`src.features`). Ese módulo vive en `ml-service/src/` (y `datascience/src/`).

Redeploy **Render** (ML) solo cuando el equipo quiera cambiar predicciones en prod.  
**OCI backend** no requiere redeploy por los joblibs; sí si querés aplicar los nuevos defaults de `insulation-factor-*` en la VM (hoy no se toca).

## No hecho (a propósito)

- Merge completo de `origin/datascience` (no hay merge-base limpio).
- Merge de `refactor-backend-recommendation` (rompe contrato prod).
- Redeploy OCI / Render automático.
