import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

class IgnoreErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false, error: null, errorInfo: null }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error: error, errorInfo: null }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('Error caught by Error Boundary:', error, errorInfo)

		this.setState({ error, errorInfo })
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return null
		}

		return this.props.children
	}
}

export default IgnoreErrorBoundary
