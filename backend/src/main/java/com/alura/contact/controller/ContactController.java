package com.alura.contact.controller;

import com.alura.common.response.ApiResponse;
import com.alura.contact.dto.ContactRequest;
import com.alura.contact.dto.ContactResponse;
import com.alura.contact.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@Tag(name = "Contacto", description = "Formulario Contáctanos")
public class ContactController {

    private final ContactService contactService;

    @Operation(summary = "Enviar mensaje de contacto al equipo")
    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> send(
            @Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.send(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Mensaje enviado. Te responderemos pronto."));
    }
}
