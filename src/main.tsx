import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-white">화면을 불러오는 중 문제가 발생했습니다</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              임시 캐시 문제일 수 있습니다. 아래 버튼을 눌러 화면을 새로고침해 주세요.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                새로고침
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                캐시 초기화
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

