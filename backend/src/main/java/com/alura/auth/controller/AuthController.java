package com.alura.auth.controller;

import com.alura.auth.dto.AuthResponse;
import com.alura.auth.dto.ForgotPasswordRequest;
import com.alura.auth.dto.ForgotPasswordResponse;
import com.alura.auth.dto.GoogleLoginRequest;
import com.alura.auth.dto.LoginRequest;
import com.alura.auth.dto.RegisterRequest;
import com.alura.auth.dto.RegisterResponse;
import com.alura.auth.dto.ResendVerificationRequest;
import com.alura.auth.dto.ResetPasswordRequest;
import com.alura.auth.dto.VerifyEmailRequest;
import com.alura.auth.service.AuthenticationService;
import com.alura.auth.service.EmailVerificationService;
import com.alura.auth.service.PasswordResetService;
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
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Registro, login y recuperacion de contrasena")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final PasswordResetService passwordResetService;
    private final EmailVerificationService emailVerificationService;

    @Operation(summary = "Registra un usuario y envia email de verificacion (sin JWT)")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authenticationService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, response.message()));
    }

    @Operation(summary = "Autentica un usuario verificado y emite un token JWT")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Autenticacion exitosa."));
    }

    @Operation(summary = "Login o registro con Google (email ya verificado por Google)")
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request) {
        AuthResponse response = authenticationService.loginWithGoogle(request.credential());
        return ResponseEntity.ok(ApiResponse.ok(response, "Autenticacion con Google exitosa."));
    }

    @Operation(summary = "Verificar email con token del enlace")
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {
        emailVerificationService.verifyEmail(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Email verificado. Ya podes iniciar sesion."));
    }

    @Operation(summary = "Reenviar enlace de verificacion de email")
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<RegisterResponse>> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {
        RegisterResponse response = emailVerificationService.resend(request.email());
        return ResponseEntity.ok(ApiResponse.ok(response, response.message()));
    }

    @Operation(summary = "Solicitar recuperacion de contrasena (email)")
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = passwordResetService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @Operation(summary = "Restablecer contrasena con token")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Contrasena actualizada."));
    }
}
