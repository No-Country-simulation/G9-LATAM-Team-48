package com.alura.security.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementacion de {@link UserDetailsService} usada por Spring Security para
 * cargar los datos de un usuario durante la autenticacion.
 *
 * <p>Esqueleto sin implementacion. En el futuro delegara en el modulo de
 * usuarios ({@code com.alura.user}) para recuperar las credenciales.</p>
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO: recuperar el usuario desde el modulo de usuarios y mapearlo a UserDetails.
        throw new UnsupportedOperationException("Pendiente de implementacion: carga de usuario.");
    }
}
