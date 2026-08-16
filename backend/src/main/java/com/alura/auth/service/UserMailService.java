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

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/**
 * Envio de mails de cuenta.
 * <p>Gmail SMTP ({@code MAIL_*}) en local y prod OCI. Resend solo si {@code RESEND_API_KEY} está definida.</p>
 */
@Service
public class UserMailService {

    private static final Logger log = LoggerFactory.getLogger(UserMailService.class);
    private static final URI RESEND_URI = URI.create("https://api.resend.com/emails");

    private final JavaMailSender mailSender;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from:}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public UserMailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    public String sendWelcomeWithPassword(String email, String name, String temporaryPassword) {
        String subject = "EnergIA — Tu cuenta fue creada";
        String body = """
                Hola %s,

                Te creamos una cuenta en EnergIA.

                Email: %s
                Contraseña temporal: %s

                Te recomendamos cambiarla al iniciar sesión.
                """.formatted(name, email, temporaryPassword);
        return send(email, subject, body);
    }

    public String sendPasswordResetLink(String email, String resetToken) {
        String link = frontendBaseUrl + "/?resetToken=" + resetToken;
        String subject = "EnergIA — Recuperar contraseña";
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
        String subject = "EnergIA — Verificá tu email";
        String body = """
                Hola,

                Gracias por registrarte en EnergIA.
                Para activar tu cuenta, verificá tu email abriendo este enlace:

                %s

                Si no creaste esta cuenta, ignorá este mensaje.
                """.formatted(link);
        return send(email, subject, body, null);
    }

    /**
     * Resultado del Analisis IA: se envia al email del usuario cliente.
     */
    public String sendAnalisisResult(
            String toEmail,
            String nivelKey,
            Integer ahorro,
            Double confidence,
            Double benchmark,
            Long consultaId) {
        String subject = "EnergIA — Resultado de tu Análisis IA";
        String confLabel = confidence == null ? "-" : String.format("%.0f%%", confidence * 100);
        String benchLabel = benchmark == null ? "-" : String.format("%.0f", benchmark);
        String body = """
                Hola,

                Ya procesamos tu consulta de Análisis IA (#%s).

                Nivel: %s
                Ahorro estimado: %s%%
                Confianza: %s
                Referencia (benchmark): %s kWh

                Podés volver a la app para ver más detalle:
                %s

                Equipo EnergIA — Team 48
                """.formatted(
                consultaId == null ? "-" : consultaId.toString(),
                nivelKey == null ? "-" : nivelKey,
                ahorro == null ? "-" : ahorro.toString(),
                confLabel,
                benchLabel,
                frontendBaseUrl);
        return send(toEmail, subject, body, null);
    }

    /**
     * Mensaje del formulario Contáctanos: llega a la casilla del equipo.
     */
    public String sendContactMessage(String fromName, String fromEmail, String message) {
        String inbox = resolveInbox();
        String subject = "EnergIA — Contacto de " + fromName;
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
        if (!mailEnabled) {
            log.warn("Mail deshabilitado (MAIL_ENABLED=false). Pendiente para {} | {}", to, subject);
            return "PENDING";
        }

        if (StringUtils.hasText(resendApiKey)) {
            return deliverViaResend(to, subject, body);
        }

        if (mailSender == null || !isUsableSmtpUser(mailUsername)
                || !StringUtils.hasText(resolveFrom())) {
            log.warn("Sin RESEND_API_KEY ni SMTP. Mail pendiente para {} | {} | body=\n{}",
                    to, subject, body);
            return "PENDING";
        }

        return deliverViaSmtp(to, subject, body, replyTo);
    }

    private String deliverViaResend(String to, String subject, String body) {
        try {
            String from = resolveResendFrom();
            String json = """
                    {"from":%s,"to":[%s],"subject":%s,"text":%s}
                    """.formatted(
                    jsonString(from),
                    jsonString(to),
                    jsonString(subject),
                    jsonString(body));

            HttpRequest request = HttpRequest.newBuilder(RESEND_URI)
                    .timeout(Duration.ofSeconds(20))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email enviado via Resend a {} asunto={}", to, subject);
                return "SENT";
            }

            log.error("Resend rechazo envio a {} status={} body={}",
                    to, response.statusCode(), response.body());
            log.info("Fallback link/contenido para {}:\n{}", to, body);
            return "FAILED";
        } catch (Exception ex) {
            log.error("Fallo Resend a {}: {}", to, ex.getMessage());
            log.info("Fallback link/contenido para {}:\n{}", to, body);
            return "FAILED";
        }
    }

    private String deliverViaSmtp(String to, String subject, String body, String replyTo) {
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
            log.info("Email enviado via SMTP a {} asunto={}", to, subject);
            return "SENT";
        } catch (Exception ex) {
            log.error("Fallo SMTP a {}: {}", to, ex.getMessage());
            log.info("Fallback link/contenido para {}:\n{}", to, body);
            return "FAILED";
        }
    }

    private boolean isUsableSmtpUser(String username) {
        if (!StringUtils.hasText(username)) {
            return false;
        }
        String normalized = username.trim().toLowerCase();
        return !"disabled".equals(normalized) && !"none".equals(normalized);
    }

    private String resolveFrom() {
        return StringUtils.hasText(fromAddress) ? fromAddress : mailUsername;
    }

    /** Destino del formulario de contacto. */
    private String resolveInbox() {
        if (StringUtils.hasText(fromAddress) && fromAddress.contains("@")
                && !fromAddress.contains("resend.dev")) {
            return extractEmail(fromAddress);
        }
        if (isUsableSmtpUser(mailUsername) && mailUsername.contains("@")) {
            return mailUsername.trim();
        }
        return extractEmail(resolveFrom());
    }

    private String resolveResendFrom() {
        if (StringUtils.hasText(fromAddress) && fromAddress.contains("@")) {
            return fromAddress.trim();
        }
        return "EnergIA <onboarding@resend.dev>";
    }

    private static String extractEmail(String from) {
        if (!StringUtils.hasText(from)) {
            return from;
        }
        int start = from.indexOf('<');
        int end = from.indexOf('>');
        if (start >= 0 && end > start) {
            return from.substring(start + 1, end).trim();
        }
        return from.trim();
    }

    private static String jsonString(String value) {
        if (value == null) {
            return "\"\"";
        }
        String escaped = value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
        return "\"" + escaped + "\"";
    }
}
