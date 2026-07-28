package com.alura.auth.service;

import com.alura.common.exception.BusinessException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Verifica el ID token emitido por Google Identity Services.
 */
@Service
public class GoogleTokenVerifier {

    private final String clientId;
    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${app.google.client-id:}") String clientId) {
        this.clientId = clientId == null ? "" : clientId.trim();
        if (StringUtils.hasText(this.clientId)) {
            this.verifier = new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(this.clientId))
                    .build();
        } else {
            this.verifier = null;
        }
    }

    public boolean isConfigured() {
        return verifier != null;
    }

    public GoogleProfile verify(String idToken) {
        if (!isConfigured()) {
            throw new BusinessException("Login con Google no esta configurado en el servidor");
        }
        try {
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                throw new BusinessException("Token de Google invalido o expirado");
            }
            GoogleIdToken.Payload payload = token.getPayload();
            String email = payload.getEmail();
            if (!StringUtils.hasText(email)) {
                throw new BusinessException("Google no devolvio un email");
            }
            Boolean emailVerified = payload.getEmailVerified();
            if (!Boolean.TRUE.equals(emailVerified)) {
                throw new BusinessException("El email de Google no esta verificado");
            }
            String name = (String) payload.get("name");
            if (!StringUtils.hasText(name)) {
                name = email.split("@")[0];
            }
            return new GoogleProfile(email.trim().toLowerCase(), name.trim(), payload.getSubject());
        } catch (BusinessException ex) {
            throw ex;
        } catch (GeneralSecurityException | IOException ex) {
            throw new BusinessException("No se pudo verificar el token de Google");
        }
    }

    public record GoogleProfile(String email, String name, String subject) {
    }
}
