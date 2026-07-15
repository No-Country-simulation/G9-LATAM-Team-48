package com.alura.common.constants;

/**
 * Constantes compartidas de la API.
 *
 * <p>Clase de utilidad no instanciable. Centraliza valores reutilizados para
 * evitar cadenas magicas dispersas por el codigo.</p>
 */
public final class ApiConstants {

    /** Prefijo comun de todas las rutas de la API. */
    public static final String API_BASE_PATH = "/api/v1";

    /** Cabecera estandar que transporta el token de autenticacion. */
    public static final String AUTHORIZATION_HEADER = "Authorization";

    /** Prefijo del esquema de token Bearer. */
    public static final String BEARER_PREFIX = "Bearer ";

    private ApiConstants() {
        // Clase de constantes: no instanciable.
    }
}
