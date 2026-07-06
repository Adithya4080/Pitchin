import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors in its subtree instead of letting them bubble up
 * and unmount the whole app (which is what caused the feed page to go
 * fully blank when a single post's comments failed to render).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md">
            Something went wrong loading this content.
          </div>
        )
      );
    }
    return this.props.children;
  }
}