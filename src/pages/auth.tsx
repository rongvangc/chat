import { AlertError } from "@/components/alert";
import { LoginAuthForm } from "@/components/login-auth-form";
import { RegisterAuthForm } from "@/components/register-auth-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/stores/auth";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export default function AuthenticationPage() {
  useAuth();
  const [authStep, setAuthStep] = useState<boolean>(false); // fasle treat as register step;

  const { errAuth, setAuthErr } = useAuthStore();

  const buttonSwitch = authStep ? "Register" : "Login";

  const formStep = useCallback(() => {
    if (authStep) {
      return (
        <>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email & password below to sign in chat app!
            </p>
          </div>
          <LoginAuthForm />
          {errAuth && <AlertError />}
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <RegisterAuthForm />
        {errAuth && <AlertError />}
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </>
    );
  }, [authStep, errAuth]);

  const handleSwitchStep = useCallback(() => {
    setAuthStep(!authStep);
    setAuthErr(false);
  }, [authStep, setAuthErr]);

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid max-w-none grid-cols-1 md:grid-cols-2 px-0">
        <Button
          variant="ghost"
          className="absolute right-4 top-4 md:right-8 md:top-8"
          onClick={handleSwitchStep}
        >
          {buttonSwitch}
        </Button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r md:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Shyn Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {formStep()}
          </div>
        </div>
      </div>
    </>
  );
}
