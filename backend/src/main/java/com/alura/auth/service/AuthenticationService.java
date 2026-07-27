package com.alura.auth.service;

import com.alura.auth.dto.AuthResponse;
import com.alura.auth.dto.LoginRequest;
import com.alura.auth.dto.RegisterRequest;
import com.alura.auth.dto.RegisterResponse;
import com.alura.auth.service.GoogleTokenVerifier.GoogleProfile;
import com.alura.common.constants.ApiConstants;
import com.alura.common.exception.BusinessException;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Orquesta el proceso de registro y autenticacion de usuarios.
 *
 * <p>Coordina el {@link AuthenticationManager} (verificacion de credenciales),
 * el {@link UserRepository} (persistencia), el {@link PasswordEncoder} (cifrado)
 * y el servicio de tokens para emitir el JWT.</p>
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    /** Rol por defecto asignado a los usuarios recien registrados. */
    private static final String DEFAULT_ROLE = "USER";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.alura.security.jwt.JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailVerificationService emailVerificationService;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Registra un nuevo usuario sin emitir JWT: debe verificar el email primero.
     *
     * @throws BusinessException si el email ya esta registrado
     */
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("El email ya esta registrado: " + email);
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(DEFAULT_ROLE)
                .emailVerifiedAt(null)
                .build();
        User saved = userRepository.save(user);

        return emailVerificationService.issueForNewUser(saved);
    }

    /**
     * Verifica las credenciales y el email, y devuelve un token si son validas.
     *
     * <p>Si las credenciales son incorrectas, el {@link AuthenticationManager}
     * lanza {@code BadCredentialsException}, traducida a HTTP 401 por el
     * manejador global de excepciones.</p>
     */
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        if (!user.isEmailVerified()) {
            throw new BusinessException(
                    "Debes verificar tu email antes de iniciar sesion. Revisa tu correo.");
        }

        return buildToken(email);
    }

    /**
     * Login/registro con Google Identity Services.
     * El email ya viene verificado por Google: emite JWT sin link de mail.
     */
    @Transactional
    public AuthResponse loginWithGoogle(String credential) {
        GoogleProfile profile = googleTokenVerifier.verify(credential);
        User user = userRepository.findByEmail(profile.email()).orElse(null);

        if (user == null) {
            String randomPassword = randomUnusablePassword();
            user = User.builder()
                    .name(profile.name())
                    .email(profile.email())
                    .password(passwordEncoder.encode(randomPassword))
                    .role(DEFAULT_ROLE)
                    .emailVerifiedAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
        } else if (!user.isEmailVerified()) {
            // Cuenta local pendiente: Google confirma el mismo email → marcar verificado
            user.setEmailVerifiedAt(LocalDateTime.now());
            if (user.getName() == null || user.getName().isBlank()) {
                user.setName(profile.name());
            }
            userRepository.save(user);
        }

        return buildToken(profile.email());
    }

    private String randomUnusablePassword() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private AuthResponse buildToken(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, ApiConstants.BEARER_PREFIX.trim());
    }
}
