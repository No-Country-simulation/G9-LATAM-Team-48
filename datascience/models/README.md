# Artefactos del modelo (export notebooks)

Ruta de export desde `notebooks/06_Modelos.ipynb` (rama datascience):

| Archivo | Uso |
|---------|-----|
| `columnas_requeridas_final_v3.joblib` | Orden/nombres de entrada del modelo v3 |
| `label_encoder_v3.joblib` | Encoder(s) de categorías / objetivo |
| `modelo_perfil_energetico_final_v3.joblib` | Pipeline o clasificador v3 |

**Git:** los `*.joblib` están ignorados por defecto; para versionarlos:

```powershell
git add -f datascience/models/columnas_requeridas_final_v3.joblib `
           datascience/models/label_encoder_v3.joblib `
           datascience/models/modelo_perfil_energetico_final_v3.joblib
```

**Deploy:** el Dockerfile de `ml-service` copia estos archivos a `/app/models/` en Render. Local:

```powershell
.\ml-service\scripts\copy-v3-models.ps1
```
