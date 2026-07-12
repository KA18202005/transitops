"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import Button from "../ui/Button";
import Input from "../ui/Input";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info"); // "info" | "success" | "error"

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
    setStatusType("info");

    try {
      await login(values);
      setStatusType("success");
      setStatusMessage("Login successful! Redirecting...");
    } catch (error) {
      const errorMsg = getApiErrorMessage(error, "Invalid email or password.");
      setStatusType("error");
      setStatusMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
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
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
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

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
        <ShieldCheck size={16} className="text-slate-700" />
        <span>Protected access for authorized personnel only.</span>
      </div>

      {statusMessage ? (
        <div
          className={`rounded-xl border px-3.5 py-3 text-sm flex items-start gap-2.5 ${
            statusType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : statusType === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
          aria-live="polite"
        >
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : null}
    </form>
  );
}
