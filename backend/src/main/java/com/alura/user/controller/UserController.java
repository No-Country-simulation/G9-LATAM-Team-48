package com.alura.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Puntos de entrada REST del modulo de usuarios.
 *
 * <p>Esqueleto sin endpoints. Expondra la consulta y gestion de perfiles
 * (por ejemplo {@code GET /api/v1/users/{id}}).</p>
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    // TODO: GET /{id} -> UserResponse findById(@PathVariable Long id)
    // TODO: GET /me   -> UserResponse currentUser(Authentication authentication)
}
