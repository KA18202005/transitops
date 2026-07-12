"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { z } from "zod";
import Button from "../ui/Button";
import Input from "../ui/Input";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setStatusMessage("");

    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatusMessage("Login form validated. Authentication API integration is pending.");
    setIsSubmitting(false);
    console.info("Login form submitted", values);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="name@company.com"
        autoComplete="email"
        error={errors.email?.message}
        leftIcon={<Mail size={16} />}
        {...register("email")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        leftIcon={<Lock size={16} />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("password")}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting} loading={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      {statusMessage ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
