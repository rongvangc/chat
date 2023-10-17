import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./globals.css";
import AuthenticationPage from "./pages/auth.tsx";
import ChatPage from "./pages/chat.tsx";
import ErrorBoundary from "./hooks/useErrorBoundary.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticationPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
