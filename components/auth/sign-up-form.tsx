
"use client";

import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import { BriefcaseBusinessIcon, ShieldCheckIcon, UserRoundIcon } from "lucide-react";

import { GoogleIcon } from "@/components/auth/google-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";

const roleOptions = [
  {
    value: "job-seeker",
    label: "Job Seeker",
    description: "Find your next role",
    icon: UserRoundIcon,
    iconClass: "text-primary",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Hire great talent",
    icon: BriefcaseBusinessIcon,
    iconClass: "text-primary",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Manage the platform",
    icon: ShieldCheckIcon,
    iconClass: "text-amber-400",
  },
] as const;

function SignUpForm() {
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);

    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;
    const acceptedTerms = formData.get("acceptedTerms") === "true";

    // Password validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    // Terms validation
    if (!acceptedTerms) {
      setErrorMessage("Please accept the Terms of Service.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role: role as "job-seeker" | "recruiter" | "admin",
        callbackURL: "/",
      });

      if (error) {
        const message = error.message || "Registration failed.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      // Email verification is currently disabled — the user is created
      // immediately. Point them to sign in.
      setSuccessMessage(
        "Account created! You can now sign in with your email and password."
      );
      toast.success("Account created! You can now sign in.");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        const message = error.message || "Google sign up failed.";
        setErrorMessage(message);
        toast.error(message);
        setGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Unable to sign up with Google.");
      toast.error("Unable to sign up with Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-2">
        <Label>Choose your role</Label>

        <div className="grid gap-3 sm:grid-cols-3">
          {roleOptions.map((option, index) => (
            <label
              key={option.value}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 transition-colors",
                "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                "has-[:checked]:border-primary/60 has-[:checked]:bg-primary/10"
              )}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                defaultChecked={index === 0}
                className="sr-only"
              />

              <option.icon
                className={cn("mt-0.5 size-5 shrink-0", option.iconClass)}
              />

              <span className="grid gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>

                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="signup-full-name">Full name</Label>

        <Input
          id="signup-full-name"
          name="fullName"
          type="text"
          placeholder="Amara Okafor"
          autoComplete="name"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email</Label>

        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signup-password">Password</Label>

          <PasswordInput
            id="signup-password"
            name="password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signup-confirm-password">
            Confirm password
          </Label>

          <PasswordInput
            id="signup-confirm-password"
            name="confirmPassword"
            placeholder="Type it again"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      <label
        htmlFor="signup-terms"
        className="flex items-start gap-2 text-sm text-muted-foreground"
      >
        <Checkbox
          id="signup-terms"
          name="acceptedTerms"
          value="true"
          uncheckedValue="false"
          className="mt-0.5"
        />

        <span>
          I agree to the{" "}
          <Link
            href="#"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
        </span>
      </label>

      {successMessage && (
        <p
          role="status"
          className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-center text-sm text-foreground/90"
        >
          {successMessage}
        </p>
      )}

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
        {loading ? "Creating Account..." : "Create Account"}
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
        onClick={handleGoogleSignUp}
        disabled={loading || googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? "Connecting..." : "Sign up with Google"}
      </Button>
    </form>
  );
}

export { SignUpForm };
