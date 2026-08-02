# Selección de Modelo — Perfil Energético (EnergIA)

## Modelo seleccionado: LightGBM

**Criterio de selección:** Mayor F1-Score entre candidatos sin evidencia de sobreajuste (punto 10, criterio 1).

## Resultados de validación cruzada (5-fold Stratified)

| Modelo | F1 | Gap Train-Test | Fit time (s) | Sobreajuste |
|---|---|---|---|---|
| LightGBM | 0.9175 | 0.0238 | 33.25 | No |
| XGBoost | 0.9143 | 0.0548 | 39.92 | Sí (descartado) |
| Gradient Boosting | 0.9024 | 0.0082 | 713.99 | No |
| Logistic Regression | 0.9014 | 0.0032 | 25.28 | No |
| Random Forest | 0.9010 | 0.0990 | 85.60 | Sí (descartado) |
| Decision Tree | 0.8471 | 0.1529 | 16.19 | Sí (descartado) |

## Justificación
LightGBM superó al segundo mejor candidato (Gradient Boosting) por 0.0151 en F1 (no hay empate técnico),
con mejor tiempo de inferencia y menor gap de generalización que XGBoost.

## Reproducibilidad
- random_state = 42
- Stratified K-Fold, 5 folds
- Exportado vía Joblib: `modelo_perfil_energetico.joblib`, `label_encoder.joblib`
