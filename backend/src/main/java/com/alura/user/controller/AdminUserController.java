package com.alura.user.controller;

import com.alura.common.dto.PageResponse;
import com.alura.common.response.ApiResponse;
import com.alura.common.util.PageRequests;
import com.alura.user.dto.AdminCreateUserRequest;
import com.alura.user.dto.AdminUpdateUserRequest;
import com.alura.user.dto.AdminUserCreatedResponse;
import com.alura.user.dto.UserResponse;
import com.alura.user.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * CRUD de usuarios (solo rol ADMIN).
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Usuarios", description = "Gestion de usuarios (solo ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "Listar usuarios (paginado)")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "" + PageRequests.DEFAULT_SIZE) int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.listPage(page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por id")
    public ResponseEntity<ApiResponse<UserResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminUserService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Crear usuario (envia password temporal por email)")
    public ResponseEntity<ApiResponse<AdminUserCreatedResponse>> create(
            @Valid @RequestBody AdminCreateUserRequest request) {
        AdminUserCreatedResponse created = adminUserService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Usuario creado. Se encolo el email con la contrasena."));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<ApiResponse<UserResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok(adminUserService.update(id, request), "Usuario actualizado."));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar usuario (borrado logico)")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id, Authentication authentication) {
        adminUserService.delete(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(null, "Usuario desactivado (borrado logico)."));
    }
}
