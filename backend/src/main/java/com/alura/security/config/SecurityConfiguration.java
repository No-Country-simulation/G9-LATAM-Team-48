package com.alura.security.config;

import com.alura.security.filter.JwtAuthenticationFilter;
import com.alura.security.jwt.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuracion central de Spring Security con autenticacion por JWT.
 *
 * <p>Puntos clave:</p>
 * <ul>
 *     <li>API <strong>sin estado</strong> (STATELESS): no hay sesiones de servidor.</li>
 *     <li>CSRF deshabilitado (innecesario en una API stateless con tokens).</li>
 *     <li>Rutas publicas: autenticacion, documentacion OpenAPI y health check.</li>
 *     <li>El resto de rutas requieren un token JWT valido.</li>
 *     <li>El {@link JwtAuthenticationFilter} se ejecuta antes del filtro estandar
 *         de usuario/contrasena.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    /** Rutas accesibles sin autenticacion. */
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/contact",
            "/api/v1/contact/**",
            "/api/v1/predictions/**",
            "/api/recomendaciones",
            "/api/recomendaciones/**",
            "/api/v1/recommendations/**",
            "/api/consumos",
            "/api/consumos/**",
            "/api/analytics",
            "/api/analytics/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/actuator/health"
    };

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public SecurityConfiguration(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        // Analisis: POST publico (guarda anonimo o con JWT);
                        // GET /api/analisis/mis requiere autenticacion.
                        .requestMatchers(HttpMethod.POST, "/api/analisis").permitAll()
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtService, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }
}
