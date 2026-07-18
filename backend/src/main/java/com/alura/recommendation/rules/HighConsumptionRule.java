package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import lombok.NonNull;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Regla de recomendación para usuarios con perfiles de alto consumo energético.
 *
 * <p>Esta clase forma parte del motor de reglas bajo el patrón Strategy.
 * Evalúa si la categoría de consumo corresponde a un perfil alto y provee
 * sugerencias orientadas a mitigar el impacto y reducir el gasto.</p>
 *
 * <p>Cumple con el <b>Principio de Responsabilidad Única (SRP)</b> al delegar
 * la redacción y traducción de los mensajes al componente {@link MessageSource}
 * de Spring, eliminando textos duros del código fuente Java.</p>
 *
 * @author miyo
 * @version 1.0
 */
@Component
public class HighConsumptionRule implements RecommendationRule {

    private final MessageSource messageSource;

    /**
     * Construye una nueva instancia de la regla de alto consumo.
     *
     * @param messageSource resolvedor de mensajes para internacionalización (i18n).
     *                       Lombok garantiza la no-nulidad mediante {@code @NonNull}.
     */
    public HighConsumptionRule(@NonNull MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Evalúa si esta regla de recomendación aplica para el contexto de usuario provisto.
     *
     * <p>La regla aplica si la categoría de consumo del request es "HIGH" o "ALTO"
     * (sin distinguir mayúsculas de minúsculas).</p>
     *
     * @param request contexto de evaluación que contiene la categoría del usuario.
     * @return {@code true} si la categoría corresponde a alto consumo; {@code false} de lo contrario.
     */
    @Override
    public boolean applies(RecommendationRequest request) {
        if (request == null || request.category() == null) {
            return false;
        }
        String category = request.category().trim().toUpperCase();
        return "HIGH".equals(category) || "ALTO".equals(category);
    }

    /**
     * Genera el mensaje de recomendación localizado para perfiles de alto consumo.
     *
     * <p>Obtiene dinámicamente el idioma del hilo de ejecución mediante
     * {@link LocaleContextHolder#getLocale()} para resolver la traducción correcta.</p>
     *
     * @param request contexto de evaluación.
     * @return el mensaje de recomendación traducido según la localización del usuario.
     */
    @Override
    public String evaluate(RecommendationRequest request) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage("recommendation.high.consumption", null, locale);
    }
}