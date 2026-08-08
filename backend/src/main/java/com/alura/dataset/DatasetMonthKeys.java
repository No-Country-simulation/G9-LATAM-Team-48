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

    /** Convierte clave i18n ({@code january}…) a número de mes 1–12. */
    public static java.util.OptionalInt mesNumeroFromKey(String monthKey) {
        if (monthKey == null || monthKey.isBlank()) {
            return java.util.OptionalInt.empty();
        }
        String normalized = monthKey.trim().toLowerCase(java.util.Locale.ROOT);
        for (int i = 0; i < KEYS.length; i++) {
            if (KEYS[i].equals(normalized)) {
                return java.util.OptionalInt.of(i + 1);
            }
        }
        return java.util.OptionalInt.empty();
    }
}
