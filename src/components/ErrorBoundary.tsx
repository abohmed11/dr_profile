import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">عذراً، حدث خطأ غير متوقع أثناء تحميل الصفحة</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                تم التقاط الخطأ بنجاح لتجنب الشاشة البيضاء. يمكنك إعادة تحميل الصفحة أو إعادة ضبط الذاكرة المؤقتة.
              </p>
            </div>

            {this.state.error && (
              <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 text-right overflow-x-auto text-[11px] font-mono text-red-300 max-h-32">
                {this.state.error.message || 'Unknown Error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="py-3 px-4 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                مسح البيانات المؤقتة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
