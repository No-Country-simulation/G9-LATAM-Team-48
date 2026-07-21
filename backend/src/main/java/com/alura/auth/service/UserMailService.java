package com.alura.auth.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Envio de mails de cuenta via SMTP (Gmail u otro proveedor).
 * Si el mail no esta configurado o falla, deja el link en logs para desarrollo.
 */
@Service
public class UserMailService {

    private static final Logger log = LoggerFactory.getLogger(UserMailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from:}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public UserMailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public String sendWelcomeWithPassword(String email, String name, String temporaryPassword) {
        String subject = "EnergyAI — Tu cuenta fue creada";
        String body = """
                Hola %s,

                Te creamos una cuenta en EnergyAI.

                Email: %s
                Contraseña temporal: %s

                Te recomendamos cambiarla al iniciar sesión.
                """.formatted(name, email, temporaryPassword);
        return send(email, subject, body);
    }

    public String sendPasswordResetLink(String email, String resetToken) {
        String link = frontendBaseUrl + "/?resetToken=" + resetToken;
        String subject = "EnergyAI — Recuperar contraseña";
        String body = """
                Hola,

                Recibimos un pedido para restablecer tu contraseña.
                Abrí este enlace (válido por tiempo limitado):

                %s

                Si no fuiste vos, ignorá este mensaje.
                """.formatted(link);
        return send(email, subject, body);
    }

    public String sendEmailVerificationLink(String email, String verificationToken) {
        String link = frontendBaseUrl + "/?verifyToken=" + verificationToken;
        String subject = "EnergyAI — Verificá tu email";
        String body = """
                Hola,

                Gracias por registrarte en EnergyAI.
                Para activar tu cuenta, verificá tu email abriendo este enlace:

                %s

                Si no creaste esta cuenta, ignorá este mensaje.
                """.formatted(link);
        return send(email, subject, body, null);
    }

    /**
     * Mensaje del formulario Contáctanos: llega a la casilla SMTP del equipo.
     */
    public String sendContactMessage(String fromName, String fromEmail, String message) {
        String inbox = resolveFrom();
        String subject = "EnergyAI — Contacto de " + fromName;
        String body = """
                Nuevo mensaje desde Contáctanos

                Nombre: %s
                Email: %s

                Mensaje:
                %s
                """.formatted(fromName, fromEmail, message);
        return send(inbox, subject, body, fromEmail);
    }

    private String send(String to, String subject, String body) {
        return send(to, subject, body, null);
    }

    private String send(String to, String subject, String body, String replyTo) {
        if (!mailEnabled || mailSender == null || !StringUtils.hasText(mailUsername)
                || !StringUtils.hasText(resolveFrom())) {
            log.warn("SMTP no configurado. Mail pendiente para {} | {} | body=\n{}", to, subject, body);
            return "PENDING";
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(resolveFrom());
            helper.setTo(to);
            if (StringUtils.hasText(replyTo)) {
                helper.setReplyTo(replyTo);
            }
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(message);
            log.info("Email enviado a {} asunto={}", to, subject);
            return "SENT";
        } catch (Exception ex) {
            log.error("Fallo envio de email a {}: {}", to, ex.getMessage());
            log.info("Fallback link/contenido para {}:\n{}", to, body);
            return "FAILED";
        }
    }

    private String resolveFrom() {
        return StringUtils.hasText(fromAddress) ? fromAddress : mailUsername;
    }
}
