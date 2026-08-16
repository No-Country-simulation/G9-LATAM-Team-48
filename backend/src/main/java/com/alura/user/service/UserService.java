package com.alura.user.service;

import com.alura.user.dto.UserResponse;

/**
 * Orquesta la logica de gestion de usuarios (consulta de perfiles).
 */
public interface UserService {

    /**
     * Recupera el perfil publico de un usuario a partir de su email.
     *
     * @param email correo electronico (identificador de acceso)
     * @return vista publica del usuario
     */
    UserResponse findByEmail(String email);
}
