import { monthsFull, monthsShort } from '../shared/monthsCalendar.js'

export const pagesPl = {
  "states": {
    "loading": "Ładowanie...",
    "loadingConsumo": "Ładowanie danych zużycia...",
    "loadingHistorial": "Ładowanie historii...",
    "loadingRecomendaciones": "Ładowanie rekomendacji...",
    "empty": "Brak danych do wyświetlenia.",
    "error": "Nie udało się załadować danych.",
    "retry": "Spróbuj ponownie"
  },
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Zużycie w ostatnim miesiącu",
    "lastMonthCost": "Koszt w ostatnim miesiącu",
    "monthlyAverage": "Średnia miesięczna"
  },
  "consumos": {
    "title": "Zużycie energii",
    "subtitle": "Miesięczny podział kWh i szacowanego kosztu.",
    "totalUsage": "Całkowite zużycie",
    "totalCost": "Całkowity koszt",
    "monthlyAverage": "Średnia miesięczna",
    "history": "Historia miesięczna",
    "peak": "Najwyższe zużycie",
    "month": "Miesiąc",
    "usageKwh": "Zużycie (kWh)",
    "estimatedCost": "Szacowany koszt",
    "status": "Status",
    "aboveAverage": "Powyżej średniej",
    "normal": "Normalne"
  },
  "chart": {
    "title": "Miesięczne zużycie energii (kWh)",
    "actualVsPredicted": "Rzeczywiste vs prognoza (kWh)",
    "actualVsPredictedHint": "Mock dla Data Analysis: porównanie zużycia z prognozą modelu.",
    "peakVsOffPeak": "Szczyt vs poza szczytem (kWh)",
    "peakVsOffPeakHint": "Mock dla Data Analysis: podział zużycia na godziny szczytu i poza szczytem.",
    "seriesActual": "Rzeczywiste",
    "seriesPredicted": "Prognoza",
    "seriesPeak": "Szczyt",
    "seriesOffPeak": "Poza szczytem",
    "axisMonth": "Miesiąc",
    "axisKwh": "kWh",
    "confidence": "Pewność modelu",
    "categories": {
      "LOW_CONSUMPTION": "Niskie zużycie",
      "MEDIUM_CONSUMPTION": "Średnie zużycie",
      "HIGH_CONSUMPTION": "Wysokie zużycie"
    }
  },
  "analysis": {
    "title": "Inteligentna analiza AI",
    "subtitle": "Ocena zużycia według typu instalacji",
    "installationType": "Typ instalacji",
    "types": {
      "APARTAMENTO": "Apartament",
      "CASA_UNIFAMILIAR": "Dom jednorodzinny",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Mały lokal handlowy"
    },
    "typeHints": {
      "APARTAMENTO": "Dane apartamentu do szacowania zużycia na osobę i klimatyzacji.",
      "CASA_UNIFAMILIAR": "Dane domu do szacowania zużycia na osobę i klimatyzacji.",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Dane lokalu do szacowania zużycia wg zajętości, urządzeń i godzin."
    },
    "monthlyUsage": "Miesięczne zużycie (kWh)",
    "people": "Liczba osób",
    "peopleCommercial": "Liczba osób (zajętość)",
    "devices": "Liczba urządzeń",
    "homeArea": "Powierzchnia mieszkania (m²)",
    "climateHours": "Godziny klimatyzacji dziennie",
    "peakUseHours": "Godziny intensywnego użycia dziennie",
    "peakHoursUse": "Peak hours",
    "shifts": "Zmiany dziennie",
    "machines": "Liczba maszyn",
    "area": "Powierzchnia zakładu (m²)",
    "hoursPerDay": "Godziny pracy dziennie",
    "processIntensity": "Intensywność procesu",
    "hasCompressedAir": "Czy używa sprężonego powietrza?",
    "lines": "Linie produkcyjne",
    "operatingDays": "Dni pracy w miesiącu",
    "capacityPct": "Wykorzystana zdolność (%)",
    "hasMonitoring": "Czy ma monitoring energetyczny / SCADA?",
    "intensity": {
      "baja": "Niska",
      "media": "Średnia",
      "alta": "Wysoka"
    },
    "yesNo": {
      "yes": "Tak",
      "no": "Nie"
    },
    "submit": "Analizuj zużycie",
    "submitting": "Analizowanie...",
    "panelHint": "Wypełnij pola wybranego typu i uruchom analizę.",
    "result": "Wynik AI",
    "level": "Poziom",
    "estimatedSavings": "Szacowane oszczędności",
    "tips": "Wskazówki poprawy zużycia",
    "confidence": "Pewność modelu",
    "sourceMl": "wytrenowany model",
    "sourceLocal": "reguły lokalne",
    "failed": "Nie udało się ukończyć analizy.",
    "loginRequired": "Zaloguj się lub zarejestruj, aby otrzymać raport analizy e-mailem.",
    "emailLoginHint": "Zaloguj się lub zarejestruj, aby otrzymać raport analizy e-mailem.",
    "loginCta": "Zaloguj / Zarejestruj",
    "emailHint": "Wyslemy analize na",
    "emailPending": "Wyslemy Ci tez te analize e-mailem wkrotce.",
    "emailSent": "Wyslalismy Ci te analize e-mailem.",
    "chart": {
      "title": "Twoje zużycie vs referencja",
      "hint": "Referencja dostosowuje się do danych formularza.",
      "empty": "Wpisz miesięczne zużycie, aby zobaczyć wykres.",
      "seriesYours": "Twoje zużycie",
      "seriesBenchmark": "Referencja"
    },
    "levels": {
      "efficient": "Efektywne",
      "moderate": "Umiarkowane",
      "inefficient": "Nieefektywne"
    },
    "tipsList": {
      "led": "Używać oświetlenia LED",
      "peak": "Zmniejszyć zużycie w godzinach szczytu",
      "appliances": "Optymalizować użycie urządzeń",
      "ac": "Ograniczyć klimatyzację",
      "replace": "Wymienić stare urządzenia",
      "night": "Kontrolować zużycie nocne",
      "keep": "Utrzymać obecne nawyki",
      "monitor": "Dalej monitorować zużycie",
      "insulation": "Poprawić izolację termiczną mieszkania",
      "standby": "Wyłączać tryb czuwania przy niskim użyciu",
      "solar": "Rozważyć fotowoltaikę na pokrycie szczytów",
      "shifts": "Przenieść procesy poza szczyt",
      "commercial": "Optymalizuj godziny pracy i sprzęt lokalu handlowego",
      "house": "Priorytet: izolacja i efektywna klimatyzacja w domu",
      "apartment": "Korzystaj ze stref wspólnych i ograniczaj standby w mieszkaniu",
      "default": "Priorytet: oświetlenie LED i sprzęt o wysokiej efektywności energetycznej",
      "motors": "Sprawdzić sprawność silników i falowników",
      "compressedAir": "Wykryć wycieki i zoptymalizować sprężone powietrze",
      "processHeat": "Odzyskać ciepło procesowe lub izolować piece",
      "loadBalancing": "Równoważyć obciążenie między maszynami i zmianami",
      "idleLines": "Wyłączyć lub uśpić nieużywane linie",
      "schedules": "Optymalizować harmonogramy produkcji",
      "predictive": "Stosować konserwację predykcyjną",
      "scada": "Wdrożyć lub rozszerzyć monitoring / SCADA",
      "capacity": "Dostosować produkcję do realnie używanej mocy"
    }
  },
  "recommendations": {
    "title": "Rekomendacje AI",
    "subtitle": "Spersonalizowane wskazówki optymalizacji zużycia.",
    "total": "Łącznie rekomendacji",
    "highPriority": "Wysoki priorytet",
    "potentialSavings": "Skumulowany potencjał oszczędności",
    "estimatedSavings": "Szacowane oszczędności",
    "priority": {
      "high": "Wysoki",
      "medium": "Średni",
      "low": "Niski"
    },
    "category": {
      "lighting": "Oświetlenie",
      "habits": "Nawyki",
      "climate": "Klimat",
      "equipment": "Sprzęt",
      "tech": "Technologia"
    },
    "items": {
      "1": {
        "title": "Zamienić tradycyjne oświetlenie na LED",
        "description": "Wymiana żarówek żarowych może zmniejszyć zużycie oświetlenia nawet o 80%."
      },
      "2": {
        "title": "Zmniejszyć zużycie w godzinach szczytu",
        "description": "Uruchamiać urządzenia poza godzinami 18:00–22:00, aby uniknąć szczytów."
      },
      "3": {
        "title": "Zoptymalizować użycie klimatyzacji",
        "description": "Utrzymywać temperaturę 24–26 °C i używać trybu eco w nocy."
      },
      "4": {
        "title": "Sprawdzić stare urządzenia o wysokim zużyciu",
        "description": "Zidentyfikować lodówki, mikrofale lub pralki starsze niż 10 lat."
      },
      "5": {
        "title": "Odłączać ładowarki w trybie czuwania",
        "description": "Unikać poboru biernego, wyłączając nieużywane zasilacze i urządzenia."
      },
      "6": {
        "title": "Zainstalować inteligentny termostat",
        "description": "Automatyzować ogrzewanie i chłodzenie według harmonogramu obecności."
      }
    }
  },
  "months": monthsFull.pl,
  "monthsShort": monthsShort.pl,
  "insights": {
    "title": "Jak wygląda Twoje zużycie?",
    "subtitle": "Jasne podsumowanie dla każdego w domu lub firmie.",
    "trend": {
      "up": "W {month} zużyłeś o {pct}% więcej energii niż w {prevMonth} (o {kwh} kWh więcej).",
      "down": "W {month} spadło o {pct}% względem {prevMonth} (zaoszczędzono {kwh} kWh).",
      "flat": "W {month} zużycie było prawie jak w {prevMonth}."
    },
    "peak": "{pct}% energii w {month} przypadło na godziny szczytu (zwykle droższe).",
    "bill": {
      "up": "Szacowany rachunek za {month}: ${amount} (ok. ${diff} więcej niż poprzednio).",
      "down": "Szacowany rachunek za {month}: ${amount} (ok. ${diff} mniej niż poprzednio).",
      "flat": "Szacowany rachunek za {month} wynosi nadal ${amount}."
    },
    "level": {
      "good": "Zużycie jest niskie: idzie dobrze.",
      "ok": "Zużycie jest średnie: drobne zmiany nadal pomogą.",
      "high": "Zużycie jest wysokie: sprawdź nawyki i urządzenia."
    },
    "tip": {
      "good": "Wskazówka: wyłączaj nieużywane urządzenia i trzymaj klimatyzację na 24–26 °C.",
      "ok": "Wskazówka: piorąc poza 18:00–22:00 zwykle płacisz mniej.",
      "high": "Wskazówka: sprawdź klimatyzację i stare urządzenia — tam zwykle największy koszt."
    }
  },
  adminUsers: {
    title: 'Użytkownicy — administracja',
    subtitle: 'Twórz, edytuj lub dezaktywuj konta systemowe.',
    create: 'Nowy użytkownik',
    refresh: 'Odśwież',
    createTitle: 'Utwórz użytkownika',
    editTitle: 'Edytuj użytkownika',
    name: 'Imię i nazwisko',
    email: 'Email',
    password: 'Hasło',
    passwordOptional: 'Hasło (opcjonalne)',
    passwordOptionalCreate: 'Hasło (opcjonalne)',
    passwordAutoHint: 'Jeśli puste, wygenerujemy hasło tymczasowe i wyślemy je e-mailem.',
    temporaryPassword: 'Hasło tymczasowe',
    emailStatus: 'Status e-maila',
    createdTitle: 'Użytkownik utworzony. Zapisz te dane (hasło widoczne tylko raz).',
    dismiss: 'Zamknij',
    passwordMin: 'Hasło musi mieć co najmniej 8 znaków.',
    role: 'Rola',
    roleUser: 'Użytkownik',
    roleAdmin: 'Admin',
    verified: 'Zweryfikowany',
    verifiedYes: 'Tak',
    verifiedNo: 'Oczekuje',
    emailVerified: 'Email zweryfikowany (logowanie bez linku)',
    emailVerifiedHint: 'Jeśli zaznaczone, użytkownik nie musi weryfikować e-maila.',
    actions: 'Akcje',
    edit: 'Edytuj',
    delete: 'Dezaktywuj',
    confirmDelete: 'Dezaktywować tego użytkownika? (miękkie usunięcie)',
    save: 'Zapisz',
    saving: 'Zapisywanie...',
    cancel: 'Anuluj',
    loginRequired: 'Zaloguj się jako administrator, aby zarządzać użytkownikami.',
    forbidden: 'Tylko administratorzy mają dostęp do tej sekcji.',
    sessionInvalid: 'Sesja nie jest ważna dla backendu. Wyloguj się i zaloguj ponownie jako admin.',
    loadFailed: 'Nie udało się wczytać użytkowników.',
    saveFailed: 'Nie udało się zapisać użytkownika.',
    deleteFailed: 'Nie udało się dezaktywować użytkownika.',
    cannotDeactivateAdmin: 'Nie można dezaktywować administratora',
  },
  adminAnalisis: {
    title: 'Analiza AI — historia',
    subtitle: 'Zapytania zapisane przez zalogowanych użytkowników.',
    refresh: 'Odśwież',
    recalculate: 'Przelicz według aktualnych reguł',
    recalculating: 'Przeliczanie…',
    recalculateConfirm:
      'Przeliczyć wszystkie zapisane analizy według aktualnej heurystyki? Bez e-maili i bez nowych zapytań.',
    recalculateDone:
      'Gotowe: {total} zapytań · {updated} zaktualizowanych · {unchanged} bez zmian · {skipped} pominiętych.',
    recalculateFailed: 'Nie udało się przeliczyć analiz.',
    email: 'Email',
    tipo: 'Typ',
    nivel: 'Poziom',
    ahorro: 'Oszczędność',
    confidence: 'Pewność',
    emailStatus: 'Email',
    createdAt: 'Data',
    actions: 'Akcje',
    detail: 'Szczegóły',
    detailTitle: 'Zapytanie',
    request: 'Request',
    response: 'Response',
    loginRequired: 'Zaloguj się jako administrator, aby zobaczyć analizy.',
    forbidden: 'Tylko administratorzy mają dostęp do tej sekcji.',
    sessionInvalid: 'Sesja nie jest ważna dla backendu. Wyloguj się i zaloguj ponownie jako admin.',
    loadFailed: 'Nie udało się wczytać analiz.',
  },
  contact: {
    title: 'Kontakt',
    subtitle: 'Napisz do nas — odpowiemy jak najszybciej.',
    name: 'Imię',
    email: 'E-mail',
    message: 'Wiadomość',
    messageHint: 'Minimum 10 znaków.',
    submit: 'Wyślij wiadomość',
    submitting: 'Wysyłanie...',
    success: 'Wiadomość wysłana. Wkrótce odpowiemy.',
    infoTitle: 'Dane kontaktowe',
    infoText: 'Możesz też napisać bezpośrednio na e-mail zespołu.',
    infoEmailLabel: 'E-mail',
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergIA',
    errors: {
      incomplete: 'Uzupełnij imię, e-mail i wiadomość (min. 10 znaków).',
      sendFailed: 'Nie udało się wysłać wiadomości.',
    },
  },
  team: {
    title: 'Zespół 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Twórcy EnergIA.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'CV',
    linksSoon: 'Linki do profili wkrótce.',
    tapHint: 'Dotknij, by zobaczyć linki',
    tapBack: 'Dotknij, by wrócić',
    flipFront: 'Pokaż linki profilu',
    flipBack: 'Wróć do karty',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
