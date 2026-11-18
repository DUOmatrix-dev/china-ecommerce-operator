import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let parsedFirestoreError: Record<string, unknown> | null = null;
      try {
        parsedFirestoreError = JSON.parse(this.state.errorMessage);
      } catch {
        parsedFirestoreError = null;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-lg font-semibold text-slate-900">
                Operational Data Synchronization Alert
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              {parsedFirestoreError
                ? `Firestore ${String(parsedFirestoreError.operationType || '')} operation on path "${String(parsedFirestoreError.path || '')}" encountered an access or network constraint.`
                : this.state.errorMessage}
            </p>
            {parsedFirestoreError && (
              <pre className="text-xs font-mono bg-slate-100 text-slate-800 p-3 rounded-lg overflow-x-auto mb-4">
                {JSON.stringify(parsedFirestoreError, null, 2)}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Workbench
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
