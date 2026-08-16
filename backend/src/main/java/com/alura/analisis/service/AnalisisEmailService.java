package com.alura.analisis.service;

import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.auth.service.UserMailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Envia el resultado del Analisis IA al email del cliente autenticado.
 * Si no hay email (consulta anonima), marca SKIPPED.
 */
@Service
public class AnalisisEmailService {

    private static final Logger log = LoggerFactory.getLogger(AnalisisEmailService.class);

    private final UserMailService userMailService;

    public AnalisisEmailService(UserMailService userMailService) {
        this.userMailService = userMailService;
    }

    /**
     * @return estado resultante: PENDING, SENT, FAILED, QUEUED o SKIPPED
     */
    public String enqueue(AnalisisConsultaEntity consulta) {
        String to = consulta.getUserEmail();
        if (to == null || to.isBlank()) {
            log.info(
                    "Consulta #{} anonima: sin email, se omite envio (nivel={})",
                    consulta.getId(),
                    consulta.getNivelKey());
            return "SKIPPED";
        }

        log.info(
                "Enviando resultado de analisis a {} (consulta #{}, nivel={})",
                to,
                consulta.getId(),
                consulta.getNivelKey());

        return userMailService.sendAnalisisResult(
                to,
                consulta.getNivelKey(),
                consulta.getAhorro(),
                consulta.getConfidence(),
                consulta.getBenchmark(),
                consulta.getId());
    }
}
