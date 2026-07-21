package com.alura.analisis.service;

import com.alura.analisis.persistence.AnalisisConsultaEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Envio de analisis por email (stub listo para conectar SMTP / proveedor).
 *
 * <p>Hoy solo registra el intento; el estado queda {@code PENDING} para un
 * worker o integracion futura.</p>
 */
@Service
public class AnalisisEmailService {

    private static final Logger log = LoggerFactory.getLogger(AnalisisEmailService.class);

    /**
     * @return estado resultante: PENDING (cola), SENT o FAILED
     */
    public String enqueue(AnalisisConsultaEntity consulta) {
        log.info(
                "Email de analisis encolado para {} (consulta #{}, nivel={})",
                consulta.getUserEmail(),
                consulta.getId(),
                consulta.getNivelKey());
        // TODO: integrar JavaMailSender / SendGrid / etc.
        return "PENDING";
    }
}
