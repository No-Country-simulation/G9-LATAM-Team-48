package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.rules.HighConsumptionRule;
import com.alura.recommendation.rules.LowConsumptionRule;
import com.alura.recommendation.rules.MediumConsumptionRule;
import com.alura.recommendation.rules.RecommendationRule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el servicio de recomendaciones y su motor de reglas.
 *
 * <p>Estas pruebas verifican que las traducciones dinámicas (i18n) en español,
 * inglés y portugués se resuelvan correctamente según el Locale configurado,
 * asegurando la calidad de los mensajes devueltos al usuario.</p>
 *
 * <p>Diseñado bajo un enfoque de pruebas unitarias puras y rápidas: se evitan
 * anotaciones pesadas como {@code @SpringBootTest} para garantizar tiempos de
 * ejecución en el orden de los milisegundos, ideal para flujos de CI/CD rápidos.</p>
 *
 * @author miyo
 * @version 1.1
 */
class RecommendationServiceImplTest {

    private RecommendationService recommendationService;
    private ResourceBundleMessageSource messageSource;

    /**
     * Configuración previa a cada test. Inicializa las dependencias manualmente.
     *
     * <p>Configura un {@link ResourceBundleMessageSource} de pruebas que apunta
     * directamente a los archivos de propiedades del classpath, logrando testear
     * la traducción real sin la sobrecarga del contenedor de Spring.</p>
     */
    @BeforeEach
    void setUp() {
        // Configuramos manualmente el MessageSource de pruebas apuntando a los properties reales
        messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        messageSource.setDefaultEncoding("UTF-8");

        // Creamos la lista de reglas con nuestro resolvedor de traducciones
        List<RecommendationRule> rules = List.of(
                new HighConsumptionRule(messageSource),
                new MediumConsumptionRule(messageSource),
                new LowConsumptionRule(messageSource)
        );

        // Instanciamos el servicio a probar
        recommendationService = new RecommendationServiceImpl(rules, messageSource);
    }

    /**
     * Prueba la generación de recomendaciones para perfiles de alto consumo en Español.
     *
     * <p><b>Estructura de la Prueba:</b></p>
     * <ul>
     *   <li><b>Given:</b> Un usuario con categoría de consumo elevado ("HIGH") y el Locale del hilo en Español ("es").</li>
     *   <li><b>When:</b> Se invoca el método {@code generate} del servicio.</li>
     *   <li><b>Then:</b> Se retorna una respuesta que contiene exactamente una recomendación y cuyo texto
     *   coincide con el mensaje localizado en español para perfiles de alto consumo.</li>
     * </ul>
     */
    @Test
    @DisplayName("Debería generar recomendación de alto consumo localizada en Español")
    void shouldGenerateHighConsumptionRecommendationInSpanish() {
        // Given
        LocaleContextHolder.setLocale(Locale.of("es"));
        RecommendationRequest request = new RecommendationRequest("user-123", "HIGH");

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertNotNull(response, "La respuesta no debería ser nula");
        assertEquals("user-123", response.userId(), "El ID de usuario debe coincidir");
        assertEquals(1, response.recommendations().size(), "Debería haber exactamente una recomendación");

        String recommendation = response.recommendations().get(0);
        assertTrue(recommendation.contains("Tu consumo energético es elevado"),
                "El mensaje en español debe advertir sobre el consumo elevado. Contenido: " + recommendation);
    }

    /**
     * Prueba la generación de recomendaciones para perfiles de consumo moderado en Inglés.
     *
     * <p><b>Estructura de la Prueba:</b></p>
     * <ul>
     *   <li><b>Given:</b> Un usuario con categoría de consumo medio ("MEDIO") y el Locale del hilo en Inglés ("en").</li>
     *   <li><b>When:</b> Se invoca el método {@code generate} del servicio.</li>
     *   <li><b>Then:</b> Se retorna una respuesta localizada cuyo texto coincide con las pautas de ahorro
     *   moderado configuradas en el recurso de inglés.</li>
     * </ul>
     */
    @Test
    @DisplayName("Debería generar recomendación de consumo medio localizada en Inglés")
    void shouldGenerateMediumConsumptionRecommendationInEnglish() {
        // Given
        LocaleContextHolder.setLocale(Locale.ENGLISH);
        RecommendationRequest request = new RecommendationRequest("user-456", "MEDIO");

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertNotNull(response, "La respuesta no debería ser nula");
        assertEquals("user-456", response.userId(), "El ID de usuario debe coincidir");
        assertEquals(1, response.recommendations().size(), "Debería haber exactamente una recomendación");

        String recommendation = response.recommendations().get(0);
        assertTrue(recommendation.contains("moderate consumption"),
                "El mensaje en inglés debe aconsejar sobre optimizar el consumo moderado. Contenido: " + recommendation);
    }

    /**
     * Prueba la generación de recomendaciones para perfiles de bajo consumo en Portugués.
     *
     * <p><b>Estructura de la Prueba:</b></p>
     * <ul>
     *   <li><b>Given:</b> Un usuario con categoría de bajo consumo ("LOW") y el Locale del hilo en Portugués ("pt").</li>
     *   <li><b>When:</b> Se invoca el método {@code generate} del servicio.</li>
     *   <li><b>Then:</b> Se retorna una respuesta localizada en portugués felicitando al usuario por su eficiencia energética.</li>
     * </ul>
     */
    @Test
    @DisplayName("Debería generar recomendación de bajo consumo localizada en Portugués")
    void shouldGenerateLowConsumptionRecommendationInPortuguese() {
        // Given
        LocaleContextHolder.setLocale(Locale.of("pt"));
        RecommendationRequest request = new RecommendationRequest("user-789", "LOW");

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertNotNull(response, "La respuesta no debería ser nula");
        assertEquals("user-789", response.userId(), "El ID de usuario debe coincidir");
        assertEquals(1, response.recommendations().size(), "Debería haber exactamente una recomendación");

        String recommendation = response.recommendations().get(0);
        assertTrue(recommendation.contains("baixo e eficiente"),
                "El mensaje en portugués debe felicitar por el bajo consumo. Contenido: " + recommendation);
    }

    /**
     * Prueba la respuesta por defecto cuando la categoría de consumo del perfil es desconocida.
     *
     * <p><b>Estructura de la Prueba:</b></p>
     * <ul>
     *   <li><b>Given:</b> Un request con una categoría no mapeada ("DESCONOCIDA") en Español.</li>
     *   <li><b>When:</b> Se evalúa el request a través del servicio de recomendaciones.</li>
     *   <li><b>Then:</b> El motor de reglas no activa ninguna estrategia específica y recurre de manera
     *   segura al fallback por defecto traducido al español.</li>
     * </ul>
     */
    @Test
    @DisplayName("Debería proveer recomendación por defecto traducida cuando la categoría es desconocida")
    void shouldProvideDefaultTranslatedRecommendationWhenCategoryIsUnknown() {
        // Given
        LocaleContextHolder.setLocale(Locale.of("es"));
        RecommendationRequest request = new RecommendationRequest("user-999", "DESCONOCIDA");

        // When
        RecommendationResponse response = recommendationService.generate(request);

        // Then
        assertNotNull(response, "La respuesta no debería ser nula");
        assertEquals("user-999", response.userId(), "El ID de usuario debe coincidir");
        assertEquals(1, response.recommendations().size(), "Debería contener la sugerencia de contingencia");

        String recommendation = response.recommendations().get(0);
        assertTrue(recommendation.contains("No se detectó un perfil de consumo claro"),
                "Debería retornar el mensaje por defecto en español para categorías desconocidas. Contenido: " + recommendation);
    }
}