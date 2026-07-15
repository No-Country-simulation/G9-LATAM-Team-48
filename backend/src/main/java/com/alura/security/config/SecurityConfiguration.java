package com.alura.security.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuracion central de Spring Security.
 *
 * <p>Esqueleto sin implementacion. Cuando la autenticacion se implemente, esta
 * clase debera:</p>
 * <ul>
 *     <li>Anotarse con {@code @EnableWebSecurity}.</li>
 *     <li>Declarar el {@code SecurityFilterChain}: rutas publicas (login, registro,
 *         Swagger, actuator) frente a rutas protegidas.</li>
 *     <li>Registrar el {@code JwtAuthenticationFilter} antes del filtro estandar.</li>
 *     <li>Configurar la politica de sesiones como STATELESS.</li>
 *     <li>Exponer los beans {@code PasswordEncoder} y {@code AuthenticationManager}.</li>
 * </ul>
 *
 * <p>Mientras no exista un {@code SecurityFilterChain} propio, aplica la
 * configuracion de seguridad por defecto de Spring Boot.</p>
 */
@Configuration
public class SecurityConfiguration {

    // TODO: @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter filter)
    // TODO: @Bean PasswordEncoder passwordEncoder()
    // TODO: @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration config)
}
