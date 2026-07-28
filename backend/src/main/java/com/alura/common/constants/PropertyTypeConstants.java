package com.alura.common.constants;

/**
 * Constantes centralizadas para los tipos de inmuebles del sistema.
 */
public final class PropertyTypeConstants {

    private PropertyTypeConstants() {
        throw new UnsupportedOperationException("Clase utilitaria, no instanciable");
    }

    public static final String HOUSE = "CASA_UNIFAMILIAR";
    public static final String APARTMENT = "APARTAMENTO";
    public static final String COMMERCIAL = "PEQUENO_ESTABLECIMIENTO_COMERCIAL";
}