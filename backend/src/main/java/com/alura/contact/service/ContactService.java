package com.alura.contact.service;

import com.alura.auth.service.UserMailService;
import com.alura.common.exception.BusinessException;
import com.alura.contact.dto.ContactRequest;
import com.alura.contact.dto.ContactResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final UserMailService mailService;

    public ContactResponse send(ContactRequest request) {
        String status = mailService.sendContactMessage(
                request.name().trim(),
                request.email().trim().toLowerCase(),
                request.message().trim());

        if ("FAILED".equals(status)) {
            throw new BusinessException("No se pudo enviar el mensaje. Intentalo mas tarde.");
        }
        if ("PENDING".equals(status)) {
            throw new BusinessException("El envio de email no esta configurado en el servidor.");
        }

        return new ContactResponse(status);
    }
}
