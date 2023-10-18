import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./globals.css";
import ErrorBoundary from "./hooks/useErrorBoundary.tsx";
import LoadingBoundary from "./hooks/useLoading.tsx";
import AuthenticationPage from "./pages/auth.tsx";
import ChatPage from "./pages/chat.tsx";
import { NotFound } from "./pages/not-found.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <AuthenticationPage />,
  },
  {
    id: "chat",
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LoadingBoundary>
          <RouterProvider router={router} />
        </LoadingBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
