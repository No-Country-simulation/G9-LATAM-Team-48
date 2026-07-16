package com.alura.infrastructure.client;

import org.springframework.context.annotation.Configuration;

/**
 * Configuracion base de los clientes HTTP hacia servicios externos.
 *
 * <p>Esqueleto sin implementacion. Centralizara la creacion de los clientes
 * ({@code RestClient}/{@code WebClient}) con timeouts, interceptores y manejo de
 * errores comunes, reutilizables por adaptadores como el cliente de prediccion
 * hacia FastAPI.</p>
 */
@Configuration
public class RestClientConfig {

    // TODO: @Bean RestClient predictionRestClient(...) con baseUrl configurable (prediction.api.base-url)
}
