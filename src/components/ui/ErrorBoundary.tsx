import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error('ErrorBoundary:', error); }
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Something went wrong</h2>
          <p className="text-sm opacity-60 mb-6">Please refresh the page.</p>
          <button onClick={() => location.reload()} className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
