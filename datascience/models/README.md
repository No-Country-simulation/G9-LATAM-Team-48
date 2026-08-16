# Artefactos del modelo v3 (export rama `datascience` / notebooks 08_Exportacion)

## Trio canónico (ml-service / Render)

| Archivo | Uso |
|---------|-----|
| `columnas_requeridas_final_v3.joblib` | Orden/nombres de entrada |
| `label_encoder_v3.joblib` | Encoder de clases / categorías |
| `modelo_perfil_energetico_final_v3.joblib` | Pipeline LightGBM v3 (**alias** de `model_pipeline_v3.joblib`) |

También versionado:

| Archivo | Notas |
|---------|-------|
| `model_pipeline_v3.joblib` | Nombre original del export DS |
| `metadata_v3.json` | F1 macro 0.91, 55 features, 12 crudas |
| `export_log_v3.json` / `training_config_v3.json` | Auditoría de export |

**Copiar a ml-service:**

```powershell
.\ml-service\scripts\copy-v3-models.ps1
```

**Git:** `*.joblib` ignorados por defecto; excepción `!datascience/models/*.joblib`.

```powershell
.\scripts\add-datascience-v3-models.ps1
```

Interpretación SHAP: `../reports/model_interpretation/`.
Especificación del formulario: `../docs/especificacion-formulario-modelo.md`.
