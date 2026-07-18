package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.RecommendationRule;
import lombok.NonNull;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Implementación concreta del servicio de recomendaciones energéticas.
 *
 * <p>Esta clase actúa como el orquestador del motor de recomendaciones. Evalúa dinámicamente
 * el conjunto de reglas de negocio que implementan la interfaz {@link RecommendationRule}.</p>
 *
 * <p>Diseñado bajo el principio <b>Abierto/Cerrado (OCP)</b> de SOLID: si se incorporan nuevas
 * reglas al sistema, Spring Boot las inyectará automáticamente en la lista de reglas
 * {@code rules} sin necesidad de modificar el código de este servicio.</p>
 *
 * @author miyo
 * @version 1.1
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final List<RecommendationRule> rules;
    private final MessageSource messageSource;

    /**
     * Construye el servicio inyectando dinámicamente todas las reglas de recomendación disponibles.
     *
     * @param rules         lista de implementaciones de {@link RecommendationRule} registradas en el contenedor.
     *                      Lombok garantiza la no-nulidad mediante {@code @NonNull}.
     * @param messageSource resolvedor de traducciones de mensajes.
     *                      Lombok garantiza la no-nulidad mediante {@code @NonNull}.
     */
    public RecommendationServiceImpl(@NonNull List<RecommendationRule> rules, @NonNull MessageSource messageSource) {
        this.rules = rules;
        this.messageSource = messageSource;
    }

    /**
     * Genera las sugerencias personalizadas para el usuario de acuerdo a su perfil de consumo.
     *
     * <p>El flujo operativo realiza las siguientes acciones:
     * <ol>
     *     <li>Filtra las reglas registradas que apliquen al request de entrada.</li>
     *     <li>Ejecuta y compila la salida de cada regla aplicable de forma localizada.</li>
     *     <li>Si ninguna regla aplica (o el request es inválido/desconocido), provee un mensaje
     *     de contingencia por defecto obtenido del {@link MessageSource}.</li>
     * </ol>
     * </p>
     *
     * @param request el contexto de evaluación que contiene el ID y la categoría del usuario.
     * @return la respuesta {@link RecommendationResponse} con la lista de sugerencias resultantes.
     */
    @Override
    public RecommendationResponse generate(RecommendationRequest request) {
        if (request == null) {
            return new RecommendationResponse(null, List.of(resolveDefaultMessage()));
        }

        List<String> recommendations = rules.stream()
                .filter(rule -> rule.applies(request))
                .map(rule -> rule.evaluate(request))
                .collect(Collectors.toList());

        if (recommendations.isEmpty()) {
            recommendations.add(resolveDefaultMessage());
        }

        return new RecommendationResponse(request.userId(), recommendations);
    }

    /**
     * Resuelve el mensaje de recomendación por defecto en el idioma del hilo actual.
     *
     * @return mensaje de contingencia traducido según el {@link Locale} activo.
     */
    private String resolveDefaultMessage() {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage("recommendation.default", null, locale);
    }
}