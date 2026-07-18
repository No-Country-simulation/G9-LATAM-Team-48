package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import lombok.NonNull;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Regla de recomendación para usuarios con perfiles de consumo moderado o medio.
 *
 * <p>Esta clase forma parte del motor de reglas bajo el patrón Strategy.
 * Evalúa si la categoría de consumo corresponde a un perfil medio y provee
 * pautas sencillas para optimizar el consumo diario sin sacrificar confort.</p>
 *
 * <p>Cumple con el <b>Principio de Responsabilidad Única (SRP)</b> al delegar
 * la resolución de textos al componente {@link MessageSource} de Spring.</p>
 *
 * @author miyo
 * @version 1.0
 */
@Component
public class MediumConsumptionRule implements RecommendationRule {

    private final MessageSource messageSource;

    /**
     * Construye una nueva instancia de la regla de consumo medio.
     *
     * @param messageSource resolvedor de mensajes para internacionalización (i18n).
     *                       Lombok garantiza la no-nulidad mediante {@code @NonNull}.
     */
    public MediumConsumptionRule(@NonNull MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Evalúa si esta regla de recomendación aplica para el contexto de usuario provisto.
     *
     * <p>La regla aplica si la categoría de consumo del request es "MEDIUM" o "MEDIO"
     * (sin distinguir mayúsculas de minúsculas).</p>
     *
     * @param request contexto de evaluación que contiene la categoría del usuario.
     * @return {@code true} si la categoría corresponde a consumo medio; {@code false} de lo contrario.
     */
    @Override
    public boolean applies(RecommendationRequest request) {
        if (request == null || request.category() == null) {
            return false;
        }
        String category = request.category().trim().toUpperCase();
        return "MEDIUM_CONSUMPTION".equals(category);
    }

    /**
     * Genera el mensaje de recomendación localizado para perfiles de consumo medio.
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
        return messageSource.getMessage("recommendation.medium.consumption", null, locale);
    }
}