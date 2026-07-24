export const MENU_ITEMS = [
  { id: 'dashboard', labelKey: 'menu.dashboard', icon: 'dashboard', color: 'blue' },
  { id: 'consumos', labelKey: 'menu.consumos', icon: 'consumos', color: 'amber' },
  {
    id: 'historia-consumos',
    labelKey: 'menu.historiaConsumos',
    icon: 'historia',
    color: 'indigo',
    authOnly: true,
  },
  { id: 'ia', labelKey: 'menu.ia', icon: 'ia', color: 'purple' },
  {
    id: 'recomendaciones',
    labelKey: 'menu.recomendaciones',
    icon: 'recomendaciones',
    color: 'green',
  },
  {
    id: 'contacto',
    labelKey: 'menu.contacto',
    icon: 'contacto',
    color: 'teal',
  },
  {
    id: 'admin-usuarios',
    labelKey: 'menu.adminUsuarios',
    icon: 'admin',
    color: 'rose',
    adminOnly: true,
  },
  {
    id: 'admin-analisis',
    labelKey: 'menu.adminAnalisis',
    icon: 'ia',
    color: 'purple',
    adminOnly: true,
  },
]
