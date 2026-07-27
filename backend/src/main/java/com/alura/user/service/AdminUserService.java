package com.alura.user.service;

import com.alura.auth.service.PasswordResetService;
import com.alura.auth.service.UserMailService;
import com.alura.common.exception.BusinessException;
import com.alura.common.exception.ResourceNotFoundException;
import com.alura.user.dto.AdminCreateUserRequest;
import com.alura.user.dto.AdminUpdateUserRequest;
import com.alura.user.dto.AdminUserCreatedResponse;
import com.alura.user.dto.UserResponse;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

/**
 * CRUD de usuarios para administradores.
 */
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;
    private final UserMailService userMailService;

    @Transactional(readOnly = true)
    public List<UserResponse> listAll() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getId, Comparator.nullsLast(Long::compareTo)))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(requireUser(id));
    }

    @Transactional
    public AdminUserCreatedResponse create(AdminCreateUserRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("El email ya esta registrado: " + email);
        }

        boolean generated = request.password() == null || request.password().isBlank();
        if (!generated && request.password().length() < 8) {
            throw new IllegalArgumentException(
                    "La contrasena debe tener al menos 8 caracteres");
        }
        String temporaryPassword = generated
                ? passwordResetService.generateTemporaryPassword()
                : request.password();

        // Alta admin: siempre verificado (sin token de email). Puede iniciar sesion ya.
        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(temporaryPassword))
                .role(normalizeRole(request.role()))
                .emailVerifiedAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        String emailStatus = userMailService.sendWelcomeWithPassword(
                saved.getEmail(), saved.getName(), temporaryPassword);

        return new AdminUserCreatedResponse(
                toResponse(saved),
                temporaryPassword,
                null,
                emailStatus);
    }

    @Transactional
    public UserResponse update(Long id, AdminUpdateUserRequest request) {
        User user = requireUser(id);
        String email = normalizeEmail(request.email());

        if (!user.getEmail().equalsIgnoreCase(email) && userRepository.existsByEmail(email)) {
            throw new BusinessException("El email ya esta registrado: " + email);
        }

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setRole(normalizeRole(request.role()));

        if (request.password() != null && !request.password().isBlank()) {
            if (request.password().length() < 8) {
                throw new IllegalArgumentException(
                        "La contrasena debe tener al menos 8 caracteres");
            }
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        if (request.emailVerified() != null) {
            if (Boolean.TRUE.equals(request.emailVerified())) {
                if (user.getEmailVerifiedAt() == null) {
                    user.setEmailVerifiedAt(LocalDateTime.now());
                }
            } else {
                user.setEmailVerifiedAt(null);
            }
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id, String currentAdminEmail) {
        User user = requireUser(id);
        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new BusinessException("No puedes desactivar tu propia cuenta");
        }
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new BusinessException("No se puede desactivar un usuario administrador");
        }
        // Borrado logico: no se elimina la fila de la DB
        userRepository.softDeleteById(id);
    }

    private User requireUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEmailVerified());
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeRole(String role) {
        return role == null ? "USER" : role.trim().toUpperCase();
    }
}
