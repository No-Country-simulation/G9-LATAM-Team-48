package com.alura.dataset;

/**
 * Claves de mes alineadas al i18n del frontend ({@code months.january}, etc.).
 */
public final class DatasetMonthKeys {

    private static final String[] KEYS = {
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
    };

    private DatasetMonthKeys() {
    }

    public static String fromMesNumero(int mesNumero) {
        if (mesNumero < 1 || mesNumero > 12) {
            return "january";
        }
        return KEYS[mesNumero - 1];
    }
}
