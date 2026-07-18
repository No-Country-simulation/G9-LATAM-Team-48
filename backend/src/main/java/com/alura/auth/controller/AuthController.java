package com.alura.auth.controller;

import com.alura.auth.dto.AuthResponse;
import com.alura.auth.dto.LoginRequest;
import com.alura.auth.dto.RegisterRequest;
import com.alura.auth.service.AuthenticationService;
import com.alura.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Puntos de entrada REST del modulo de autenticacion.
 *
 * <p>Expone el registro y el inicio de sesion. Ambas rutas son publicas
 * (configuradas en {@code SecurityConfiguration}) y devuelven un token JWT.</p>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Registro e inicio de sesion (emision de JWT)")
public class AuthController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "Registra un nuevo usuario y emite un token JWT")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authenticationService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Usuario registrado correctamente."));
    }

    @Operation(summary = "Autentica un usuario y emite un token JWT")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Autenticacion exitosa."));
    }
}
