import { Component, StrictMode } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 40,
            fontFamily: "system-ui, -apple-system, sans-serif",
            maxWidth: 680,
            margin: "60px auto",
            background: "#ffffff",
            border: "1.5px solid #fca5a5",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#dc2626", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            Application Error Caught
          </h2>
          <p style={{ color: "#4b5563", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            React encountered an error while mounting. This often happens if previous session data
            in your browser became out-of-sync with your new Supabase keys:
          </p>
          <pre
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: 16,
              borderRadius: 10,
              fontSize: 13,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              border: "1px solid #fee2e2",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              style={{
                background: "#16803c",
                color: "white",
                padding: "11px 22px",
                border: "none",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Clear Storage &amp; Reload App
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                padding: "11px 22px",
                border: "1px solid #d1d5db",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RootErrorBoundary>
  </StrictMode>
);
