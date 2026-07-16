package com.alura.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que se ejecuta una vez por peticion para interceptar y validar el
 * token JWT presente en la cabecera {@code Authorization}.
 *
 * <p>Esqueleto sin logica: actualmente delega directamente en la cadena de
 * filtros. La validacion del token y el establecimiento del contexto de
 * seguridad se implementaran mas adelante.</p>
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        // TODO: extraer el token de la cabecera Authorization "Bearer ...".
        // TODO: validar el token con JwtService y poblar el SecurityContext.
        filterChain.doFilter(request, response);
    }
}
