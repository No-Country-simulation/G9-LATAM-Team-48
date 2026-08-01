# Accesibilidad (EnergIA — frontend)

Guía para el equipo: qué implementamos para personas que usan **lectores de pantalla**, **solo teclado** o poca visión, y cómo probarlo sin ser usuario no vidente.

**Rama de referencia:** `Jorge-martinez` (Vercel).

---

## Objetivo

- Navegar la app **sin mouse** (Tab, Enter, Escape).
- Que un lector de pantalla (**NVDA**, **Narrador**, **VoiceOver**) anuncie **páginas**, **formularios**, **resúmenes numéricos** y **datos de gráficos** (no solo dibujos).
- Mantener **21 idiomas**: textos de accesibilidad en ES/EN con fallback al inglés en el resto (`frontend/src/i18n/locales/es.js`, `en.js` → claves `a11y.*`).

No sustituye una auditoría WCAG 2.2 AA completa; es una base sólida para demo/hackathon.

---

## Implementación en la UI

| Área | Comportamiento | Archivos clave |
|------|----------------|----------------|
| Navegación rápida | Skip links al contenido y al menú | `MainLayout.jsx`, `index.css` |
| Idioma del documento | `lang` en `<html>` según locale | `LocaleContext.jsx` |
| Anuncios dinámicos | Región `aria-live` vía `SrAnnouncer` | `SrAnnouncer.jsx`, `main.jsx` |
| Cambio de vista | Anuncio de página, tema, idioma, logout | `MainLayout.jsx`, `Header.jsx`, `LanguageMapModal.jsx` |
| Landmarks | `header`, `nav`, `main`, `aside` | `MainLayout.jsx`, `Sidebar.jsx` |
| Gráficos | SVG decorativo + **tabla SR** con mismos datos | `ChartSrTable.jsx`, `GraficoConsumo.jsx`, `GraficoRealVsPrediccion.jsx`, `GraficoPicoValle.jsx` |
| KPIs dashboard | Grupo con `aria-label` título + valor | `CardConsumo.jsx` |
| Menú | `aria-label` por ítem, `aria-current="page"` | `Sidebar.jsx` |
| Login | Modal etiquetado, anuncio al abrir, labels en formulario | `LoginModal.jsx` |
| Google GIS | Región y contenedor etiquetados; iframe es de Google | `GoogleSignInButton.jsx`, `LoginModal.jsx` |
| Mapa de idiomas | Teclado, confirmación, textos de ayuda | `LanguageMapModal.jsx` |
| Formularios | Labels y errores (p. ej. Análisis IA) | `AnalisisIA.jsx`, modales |

Patrón gráficos Recharts:

1. Contenedor del gráfico con **`aria-hidden="true"`**.
2. **`ChartSrTable`**: tabla `visually-hidden` + `<caption>` (`a11y.chartDataCaption`).

**Google Sign-In y bloqueadores:** aviso amarillo en el modal siempre que hay botón Google (`auth.googleBlockHintShort`); si el clic no abre popup o falla el script, texto ampliado (`auth.googleBlockHint`). Login por email sigue disponible (`LoginModal.jsx`, `googleSignInSupport.js`).

---

## Claves i18n (`a11y`)

| Clave | Uso |
|--------|-----|
| `skipToNav` | Segundo skip link |
| `mainNav` | Menú principal |
| `topBar` | Barra superior |
| `logoAlt` | Alt del logo |
| `pageChanged` | Anuncio al cambiar vista |
| `themeLightOn` / `themeDarkOn` | Cambio de tema |
| `languageChanged` | Cambio de idioma |
| `loggedOut` / `signedInAs` | Sesión |
| `loginDialogOpened` | Modal de login abierto |
| `googleSignInRegion` / `googleSignInButton` | Bloque Google |
| `chartDataCaption` | Caption de tablas SR de gráficos |
| `mapKeyboardHint`, `mapPending`, … | Mapa de idiomas |

---

## Cómo probar (sin ser no vidente)

### 1. Solo teclado (~5 min)

1. Cargar la app → **Tab** repetido.
2. Comprobar foco visible en **“Saltar al contenido”** y **“Saltar al menú”** → Enter.
3. Navegar menú, abrir **Entrar**, recorrer campos con Tab, cerrar con Escape.
4. Objetivo: flujo completo **sin mouse**.

### 2. Narrador (Windows)

- **Win + Ctrl + Enter** para activar/desactivar.
- Repetir navegación por menú y dashboard; debe leer títulos, botones y valores de tarjetas.

### 3. NVDA (opcional, [nvaccess.org](https://www.nvaccess.org/))

- Más fiable que Narrador en Chrome/Firefox.
- Modo exploración con flechas para leer bloques de texto.

### 4. Inspector de accesibilidad (Firefox)

- **F12** → panel **Accesibilidad**.
- En Dashboard, localizar bajo gráficos nodos **table** con caption (datos ocultos visualmente).

### 5. Lighthouse (Chrome/Edge)

- DevTools → **Lighthouse** → categoría **Accessibility** (orientativo, no reemplaza lector real).

---

## Limitaciones conocidas

- **Recharts**: solo los datos vía tabla SR; no hay sonificación del gráfico.
- **Google GIS**: depende de Google; bloqueadores pueden impedir popup (aviso preventivo + ampliado tras clic fallido).
- **Contraste / foco** en todos los estados hover/disabled: no auditado exhaustivamente.
- Páginas **admin** y formularios largos: tienen algo de ARIA pero no revisión página por página.
- Traducciones `a11y.*` completas en **ES/EN**; otros idiomas usan fallback EN vía `translate()`.

---

## Archivos principales

```
frontend/src/components/SrAnnouncer.jsx
frontend/src/components/ChartSrTable.jsx
frontend/src/layouts/MainLayout.jsx
frontend/src/components/LoginModal.jsx
frontend/src/components/GoogleSignInButton.jsx
frontend/src/components/GraficoConsumo.jsx
frontend/src/components/GraficoRealVsPrediccion.jsx
frontend/src/components/GraficoPicoValle.jsx
frontend/src/components/CardConsumo.jsx
frontend/src/components/Sidebar.jsx
frontend/src/context/LocaleContext.jsx
frontend/src/index.css                    (.skip-link)
```

---

## Mantenimiento

Al añadir un **gráfico nuevo**:

1. Título con `id` o heading visible.
2. Envolver `ResponsiveContainer` en `aria-hidden="true"`.
3. Añadir `<ChartSrTable caption={…} columns={…} rows={…} />`.

Al añadir **botones solo con icono**: siempre `aria-label` (patrón en `Header.jsx`).

Al abrir **modales** importantes: considerar `useAnnounce()` + `aria-labelledby` en el título.

---

## Documentación relacionada

- [`frontend/README.md`](../../frontend/README.md) — README principal del frontend (deploy, variables, auth, Google, capturas).
