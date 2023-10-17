import React, { useState, useEffect } from "react";

const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: unknown) => {
      console.error(error);
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  return hasError;
};

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const hasError = useErrorBoundary();

  if (hasError) {
    return (
      <div className="h-screen overflow-hidden flex flex-col items-center justify-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/chat-f60b9.appspot.com/o/error.svg?alt=media&token=9b02d7d4-1ddd-4aa9-bbe7-6c5c64c7d8e4&_gl=1*ivesw0*_ga*NzE3OTE0NDQ0LjE2OTc1MjQ0MDc.*_ga_CW55HF8NVT*MTY5NzU0ODEyOS4yLjEuMTY5NzU1MjI5NC4zNi4wLjA."
          alt="error"
          className="max-w-[30%]"
        />
        <h3 className="font-semibold text-2xl leading-none tracking-tight m-8">
          Something wrong
        </h3>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
