import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Something went wrong
          </p>
          <h1 className="mt-3 text-2xl font-bold text-zinc-900">
            The app hit an unexpected error.
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Refresh the page to recover. If it keeps happening, check the console logs.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Reload app
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
