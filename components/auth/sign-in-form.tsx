
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GoogleIcon } from "@/components/auth/google-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "true";

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.code === "EMAIL_NOT_VERIFIED"
            ? "Please verify your email before signing in. Check your inbox for the verification link."
            : error.message || "Invalid email or password."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || "Google sign-in failed.");
        setGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Unable to sign in with Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-2">
        <Label htmlFor="signin-email">Email</Label>

        <Input
          id="signin-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password">Password</Label>

          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <PasswordInput
          id="signin-password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      <label
        htmlFor="signin-remember"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Checkbox
          id="signin-remember"
          name="rememberMe"
          value="true"
          uncheckedValue="false"
          defaultChecked
        />

        Remember me for 30 days
      </label>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-10 w-full"
        disabled={loading || googleLoading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-10 w-full"
        onClick={handleGoogleSignIn}
        disabled={loading || googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? "Connecting..." : "Continue with Google"}
      </Button>
    </form>
  );
}

export { SignInForm };
