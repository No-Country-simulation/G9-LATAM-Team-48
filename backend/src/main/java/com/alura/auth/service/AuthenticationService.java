package com.alura.auth.service;

import com.alura.auth.dto.AuthResponse;
import com.alura.auth.dto.LoginRequest;
import com.alura.auth.dto.RegisterRequest;
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

    /**
     * Registra un nuevo usuario y devuelve un token para uso inmediato.
     *
     * @throws BusinessException si el email ya esta registrado
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("El email ya esta registrado: " + request.email());
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(DEFAULT_ROLE)
                .build();
        userRepository.save(user);

        return buildToken(user.getEmail());
    }

    /**
     * Verifica las credenciales y devuelve un token si son validas.
     *
     * <p>Si las credenciales son incorrectas, el {@link AuthenticationManager}
     * lanza {@code BadCredentialsException}, traducida a HTTP 401 por el
     * manejador global de excepciones.</p>
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        return buildToken(request.email());
    }

    private AuthResponse buildToken(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, ApiConstants.BEARER_PREFIX.trim());
    }
}
