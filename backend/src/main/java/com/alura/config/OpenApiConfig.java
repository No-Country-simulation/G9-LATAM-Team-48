package com.alura.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracion de la documentacion OpenAPI / Swagger UI.
 *
 * <p>Define unicamente los metadatos de la API. La configuracion de esquemas
 * de seguridad (Bearer JWT) se anadira cuando se implemente la autenticacion.</p>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI energyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Energy Backend API")
                        .description("Backend orquestador para el analisis de patrones de "
                                + "consumo energetico y clasificacion de usuarios - Hackathon ONE G9.")
                        .version("v0.1.0")
                        .contact(new Contact().name("Team 48 - LATAM"))
                        .license(new License().name("TBD")));
        // TODO: registrar el SecurityScheme "bearerAuth" cuando el modulo JWT este operativo.
    }
}
