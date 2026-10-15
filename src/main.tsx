import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./app/App";
import { AuthProvider } from "./hooks/useAuth";
import { WebsiteContentProvider } from "./hooks/useWebsiteContent";
import { ErrorBoundary } from "./app/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <WebsiteContentProvider>
          <App />
        </WebsiteContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
