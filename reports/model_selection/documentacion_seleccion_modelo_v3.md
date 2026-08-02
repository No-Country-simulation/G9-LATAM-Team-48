# Selección de Modelo — Perfil Energético (EnergIA) — Versión Final Deployable

## Modelo: LightGBM sobre 55 columnas verificadas

**Historial de iteraciones:**

| Versión | Columnas | F1 macro | Nota |
|---|---|---|---|
| Completo | 236 | 0.92 | No deployable (requiere datos no capturables en producción) |
| v2 | 103 | 0.92 | Inválido — seleccionado por coincidencia de nombre, no de dependencia real |
| **v3 (final)** | **55** | **0.91** | Verificado línea por línea contra las fórmulas reales de feature engineering |

## Métricas finales (test set)
- Accuracy: 0.91 | F1 macro: 0.91
- Eficiente: F1=0.93 | Ineficiente: F1=0.94 | Moderado: F1=0.88

## Campos de entrada requeridos (formulario)
14 campos: 8 originales + 6 nuevos (consumo mes anterior, aislamiento térmico,
% iluminación LED, antigüedad de construcción, zona geográfica, antigüedad
de electrodomésticos). Ver `columnas_requeridas_final.joblib` para el
orden y nombres exactos de las 55 columnas que espera el pipeline.

## Limitación conocida (documentada, no accidental)
Se descartaron deliberadamente los dominios: temperatura, cantidad de
unidades de A/C, iluminación detallada (focos/horas), energía solar,
cortes eléctricos/respaldo, nivel socioeconómico y certificación previa —
no capturables sin ampliar significativamente el formulario. Costo:
~1 punto de F1 macro frente al modelo completo.

## Reproducibilidad
random_state=42, Stratified K-Fold 5 folds, exportado vía Joblib.
