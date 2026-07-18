package com.alura.security.filter;

import com.alura.common.constants.ApiConstants;
import com.alura.security.jwt.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que se ejecuta una vez por peticion para interceptar y validar el
 * token JWT presente en la cabecera {@code Authorization}.
 *
 * <p>Flujo:</p>
 * <ol>
 *     <li>Si no hay cabecera {@code Authorization: Bearer <token>}, deja pasar
 *         la peticion sin autenticar (las rutas publicas seguiran funcionando;
 *         las protegidas seran rechazadas mas adelante por la cadena).</li>
 *     <li>Si hay token, extrae el usuario, lo carga y valida el token.</li>
 *     <li>Si es valido, establece la autenticacion en el
 *         {@link SecurityContextHolder}.</li>
 * </ol>
 *
 * <p>No se registra como bean para evitar el doble registro como filtro de
 * servlet; se instancia manualmente en {@code SecurityConfiguration}.</p>
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(ApiConstants.AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith(ApiConstants.BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(ApiConstants.BEARER_PREFIX.length());

        try {
            final String username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ex) {
            // Token invalido/expirado/manipulado: se continua sin autenticar.
            // La cadena de seguridad rechazara el acceso a rutas protegidas (401/403).
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
