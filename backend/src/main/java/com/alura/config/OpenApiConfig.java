package com.alura.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracion de la documentacion OpenAPI / Swagger UI.
 *
 * <p>Define los metadatos de la API y el esquema de seguridad {@code bearerAuth}
 * (JWT). Cada operacion protegida se marca con
 * {@code @SecurityRequirement(name = "bearerAuth")}, lo que habilita el boton
 * <em>Authorize</em> en Swagger UI para enviar el token.</p>
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI energyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Energy Backend API")
                        .description("Backend orquestador para el analisis de patrones de "
                                + "consumo energetico y clasificacion de usuarios - Hackathon ONE G9.")
                        .version("v0.1.0")
                        .contact(new Contact().name("Team 48 - LATAM"))
                        .license(new License().name("TBD")))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
