package com.alura.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Puntos de entrada REST del modulo de autenticacion.
 *
 * <p>Esqueleto sin endpoints. Expondra las operaciones de registro y login
 * (por ejemplo {@code POST /api/v1/auth/register} y {@code POST /api/v1/auth/login}).</p>
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    // TODO: POST /register  -> AuthResponse register(@Valid @RequestBody RegisterRequest request)
    // TODO: POST /login     -> AuthResponse login(@Valid @RequestBody LoginRequest request)
}
