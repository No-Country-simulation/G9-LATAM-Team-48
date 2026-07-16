package com.alura;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Prueba base que verifica que el contexto de Spring arranca correctamente.
 *
 * <p>Sirve como red de seguridad para la integracion continua: cualquier
 * configuracion invalida hara fallar esta prueba.</p>
 */
@SpringBootTest
class EnergyApplicationTests {

    @Test
    void contextLoads() {
        // Verifica que el ApplicationContext se levanta sin errores.
    }
}
