import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          fontFamily: 'monospace',
          background: '#1a0000',
          color: '#ff6b6b',
          minHeight: '100vh',
          wordBreak: 'break-word',
        }}>
          <h2 style={{ color: '#ff4444', marginBottom: '1rem' }}>Erro na aplicação</h2>
          <p style={{ color: '#ffaaaa', marginBottom: '1rem' }}>
            {this.state.error.message}
          </p>
          <pre style={{ fontSize: '0.75rem', color: '#ff8888', whiteSpace: 'pre-wrap' }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
