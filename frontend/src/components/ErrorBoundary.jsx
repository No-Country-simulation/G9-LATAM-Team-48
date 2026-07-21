import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: 20 }}>Error al cargar EnergyAI</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b00020' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button type="button" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
