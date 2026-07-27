package com.alura.auth.service;

import com.alura.auth.dto.RegisterResponse;
import com.alura.auth.dto.VerifyEmailRequest;
import com.alura.auth.persistence.EmailVerificationTokenEntity;
import com.alura.auth.persistence.EmailVerificationTokenRepository;
import com.alura.common.exception.BusinessException;
import com.alura.common.exception.ResourceNotFoundException;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final int TOKEN_BYTES = 32;

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final UserMailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.email-verification.ttl-hours:48}")
    private long ttlHours;

    /** Solo true en tests: no devolver el token al frontend (evita auto-verificar). */
    @Value("${app.email-verification.expose-token:false}")
    private boolean exposeToken;

    @Transactional
    public RegisterResponse issueForNewUser(User user) {
        String token = createToken(user);
        String emailStatus = mailService.sendEmailVerificationLink(user.getEmail(), token);
        // Nunca exponer el token en la respuesta de API salvo perfil/tests (expose-token=true).
        return new RegisterResponse(
                "Cuenta creada. Revisa tu email para verificarla antes de iniciar sesion.",
                emailStatus,
                exposeToken ? token : null);
    }

    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        EmailVerificationTokenEntity entity = tokenRepository.findByToken(request.token().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Token de verificacion invalido"));

        if (!entity.isUsable()) {
            throw new BusinessException("El token de verificacion expiro o ya fue usado");
        }

        User user = userRepository.findById(entity.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (user.isEmailVerified()) {
            entity.setUsedAt(LocalDateTime.now());
            tokenRepository.save(entity);
            return;
        }

        user.setEmailVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        entity.setUsedAt(LocalDateTime.now());
        tokenRepository.save(entity);
    }

    @Transactional
    public RegisterResponse resend(String emailRaw) {
        String email = emailRaw == null ? "" : emailRaw.trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        // Respuesta generica para no filtrar existencia
        if (user == null || user.isEmailVerified()) {
            return new RegisterResponse(
                    "Si el email existe y no esta verificado, enviamos un nuevo enlace.",
                    "SKIPPED",
                    null);
        }

        String token = createToken(user);
        String emailStatus = mailService.sendEmailVerificationLink(user.getEmail(), token);
        return new RegisterResponse(
                "Si el email existe y no esta verificado, enviamos un nuevo enlace.",
                emailStatus,
                exposeToken ? token : null);
    }

    private String createToken(User user) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = HexFormat.of().formatHex(bytes);

        EmailVerificationTokenEntity entity = EmailVerificationTokenEntity.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(ttlHours))
                .build();
        tokenRepository.save(entity);
        return token;
    }
}
