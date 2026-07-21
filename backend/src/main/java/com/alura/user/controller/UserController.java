package com.alura.user.controller;

import com.alura.common.response.ApiResponse;
import com.alura.user.dto.UserResponse;
import com.alura.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Puntos de entrada REST del modulo de usuarios.
 *
 * <p>Todas las rutas de este controlador estan <strong>protegidas</strong>:
 * requieren un token JWT valido (ver {@code SecurityConfiguration}).</p>
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Consulta del perfil del usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    /**
     * Devuelve el perfil del usuario autenticado. Demuestra el consumo de una
     * ruta protegida: el email se obtiene del token a traves del
     * {@link Authentication} inyectado por Spring Security.
     */
    @Operation(summary = "Perfil del usuario autenticado")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> currentUser(Authentication authentication) {
        UserResponse user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
