import { createContext, useContext } from 'react'

const NavigationContext = createContext(null)

export function NavigationProvider({ pagina, setPagina, children }) {
  return (
    <NavigationContext.Provider value={{ pagina, setPagina }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) {
    throw new Error('useNavigation debe usarse dentro de NavigationProvider')
  }
  return ctx
}
