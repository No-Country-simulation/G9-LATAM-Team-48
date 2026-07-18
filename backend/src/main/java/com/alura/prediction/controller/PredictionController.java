package com.alura.prediction.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Puntos de entrada REST del modulo de prediccion.
 *
 * <p>Esqueleto sin endpoints. Expondra la clasificacion de usuarios
 * (por ejemplo {@code POST /api/v1/predictions}).</p>
 */
@RestController
@RequestMapping("/api/v1/predictions")
public class PredictionController {

    // TODO: POST / -> PredictionResponse classify(@Valid @RequestBody PredictionRequest request)
}
