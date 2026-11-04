import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-neutral-200 text-center my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            {this.props.fallbackTitle || 'Terjadi Kendala Saat Memuat Tampilan'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mb-4">
            {this.state.error?.message || 'Gagal memuat komponen. Silakan coba muat ulang komponen ini.'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Halaman / Komponen</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
