import React, { Component } from 'react'
import { detectLocale, translate } from '../i18n'

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
      const locale = detectLocale()
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: 20 }}>{translate(locale, 'common.errorLoad')}</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b00020' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button type="button" onClick={() => window.location.reload()}>
            {translate(locale, 'common.reload')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
