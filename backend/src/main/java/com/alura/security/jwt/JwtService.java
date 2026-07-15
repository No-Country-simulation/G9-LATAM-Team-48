package com.alura.security.jwt;

import org.springframework.stereotype.Service;

/**
 * Servicio responsable de la generacion, firma y validacion de tokens JWT.
 *
 * <p>Esqueleto sin implementacion. Las responsabilidades previstas son:</p>
 * <ul>
 *     <li>Generar un token a partir de los datos de un usuario autenticado.</li>
 *     <li>Extraer el <em>subject</em> (por ejemplo, el email) desde un token.</li>
 *     <li>Validar la firma y la expiracion de un token.</li>
 * </ul>
 *
 * <p>La clave secreta y el tiempo de expiracion se inyectaran desde la
 * configuracion (ver {@code application.yml} -> {@code security.jwt}).</p>
 */
@Service
public class JwtService {

    // TODO: inyectar propiedades security.jwt.secret y security.jwt.expiration.
    // TODO: String generateToken(UserDetails userDetails);
    // TODO: String extractUsername(String token);
    // TODO: boolean isTokenValid(String token, UserDetails userDetails);
}
