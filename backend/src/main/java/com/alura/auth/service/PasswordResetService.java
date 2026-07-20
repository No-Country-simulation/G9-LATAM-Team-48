package com.alura.auth.service;

import com.alura.auth.dto.ForgotPasswordRequest;
import com.alura.auth.dto.ForgotPasswordResponse;
import com.alura.auth.dto.ResetPasswordRequest;
import com.alura.auth.persistence.PasswordResetTokenEntity;
import com.alura.auth.persistence.PasswordResetTokenRepository;
import com.alura.common.exception.BusinessException;
import com.alura.common.exception.ResourceNotFoundException;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_BYTES = 32;
    private static final int TEMP_PASSWORD_LEN = 12;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.password-reset.ttl-hours:24}")
    private long ttlHours;

    /** Solo true en tests/dev explicito: no devolver el token al frontend. */
    @Value("${app.password-reset.expose-token:false}")
    private boolean exposeToken;

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        // Respuesta generica para no filtrar si el email existe
        if (user == null) {
            return new ForgotPasswordResponse(
                    "Si el email existe, enviamos instrucciones de recuperacion.",
                    "SKIPPED",
                    null);
        }

        String token = createToken(user);
        String emailStatus = mailService.sendPasswordResetLink(user.getEmail(), token);

        return new ForgotPasswordResponse(
                "Si el email existe, enviamos instrucciones de recuperacion.",
                emailStatus,
                exposeToken ? token : null);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetTokenEntity entity = tokenRepository.findByToken(request.token().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Token de recuperacion invalido"));

        if (!entity.isUsable()) {
            throw new BusinessException("El token de recuperacion expiro o ya fue usado");
        }

        User user = userRepository.findById(entity.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        entity.setUsedAt(LocalDateTime.now());
        tokenRepository.save(entity);
    }

    @Transactional
    public String createInviteToken(User user) {
        return createToken(user);
    }

    public String generateTemporaryPassword() {
        byte[] bytes = new byte[TEMP_PASSWORD_LEN];
        secureRandom.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return raw.substring(0, Math.min(TEMP_PASSWORD_LEN, raw.length())) + "Aa1!";
    }

    private String createToken(User user) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = HexFormat.of().formatHex(bytes);

        PasswordResetTokenEntity entity = PasswordResetTokenEntity.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(ttlHours))
                .build();
        tokenRepository.save(entity);
        return token;
    }
}
