import {
  LuLayoutDashboard,
  LuZap,
  LuBrainCircuit,
  LuLightbulb,
} from 'react-icons/lu'

const ICONS = {
  dashboard: LuLayoutDashboard,
  consumos: LuZap,
  ia: LuBrainCircuit,
  recomendaciones: LuLightbulb,
}

const COLORS = {
  blue: {
    bg: 'rgba(13, 110, 253, 0.18)',
    icon: '#0d6efd',
  },
  amber: {
    bg: 'rgba(255, 193, 7, 0.22)',
    icon: '#d39e00',
  },
  purple: {
    bg: 'rgba(111, 66, 193, 0.2)',
    icon: '#6f42c1',
  },
  green: {
    bg: 'rgba(25, 135, 84, 0.18)',
    icon: '#198754',
  },
}

function MenuIcon({ name, color = 'blue', isActive = false }) {
  const Icon = ICONS[name]
  const palette = COLORS[color] || COLORS.blue

  if (!Icon) {
    return null
  }

  return (
    <span
      className="menu-icon-wrap"
      style={{
        backgroundColor: isActive ? palette.icon : palette.bg,
        color: isActive ? '#ffffff' : palette.icon,
      }}
    >
      <Icon className="menu-icon" aria-hidden="true" />
    </span>
  )
}

export default MenuIcon
