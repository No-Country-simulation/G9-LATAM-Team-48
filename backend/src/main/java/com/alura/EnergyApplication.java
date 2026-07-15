package com.alura;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicacion Energy Backend.
 *
 * <p>Este backend actua como orquestador de la solucion del Hackathon ONE G9:
 * expone la API REST, gestiona la autenticacion mediante JWT y coordina los
 * modulos de prediccion (cliente del servicio FastAPI de Machine Learning),
 * recomendaciones y calculo de costos.</p>
 *
 */
@SpringBootApplication
public class EnergyApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnergyApplication.class, args);
    }
}
