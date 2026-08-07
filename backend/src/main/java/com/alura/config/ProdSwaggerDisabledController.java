package com.alura.config;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * En prod la UI de Swagger está deshabilitada ({@code springdoc.swagger-ui.enabled=false}).
 * Sin este mapping, {@code /swagger-ui.html} puede responder 500; aquí devolvemos 404 explícito.
 */
@Profile("prod")
@RestController
public class ProdSwaggerDisabledController {

    @GetMapping({"/swagger-ui.html", "/swagger-ui/index.html"})
    public ResponseEntity<Void> swaggerUiDisabled() {
        return ResponseEntity.notFound().build();
    }
}
