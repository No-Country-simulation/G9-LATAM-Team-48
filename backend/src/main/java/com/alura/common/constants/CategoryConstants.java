package com.alura.common.constants;

/**
 * Constantes centralizadas para las categorías de consumo del sistema.
 */
public final class CategoryConstants {

    // El constructor privado evita que la clase sea instanciada
    private CategoryConstants() {
        throw new UnsupportedOperationException("Esta es una clase utilitaria y no puede ser instanciada");
    }

    public static final String HIGH = "ALTO";
    public static final String MEDIUM = "MODERADO";
    public static final String LOW = "BAJO";
}