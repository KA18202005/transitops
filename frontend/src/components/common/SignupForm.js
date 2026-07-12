"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, User, Phone, ShieldCheck, Briefcase } from "lucide-react";
import { z } from "zod";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { signup } from "@/services/auth";
import { getApiErrorMessage } from "@/services/api";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Full Name must be at least 2 characters long."),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[0-9+\- ]+$/.test(val),
        "Phone number must contain only numbers, spaces, +, or -."
      )
      .refine(
        (val) => !val || (val.length >= 7 && val.length <= 15),
        "Phone number must be between 7 and 15 characters long."
      ),
    roleId: z.string().min(1, "Please select a role."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const ROLE_OPTIONS = [
  { value: "", label: "Select your role" },
  { value: "2", label: "Fleet Manager" },
  { value: "3", label: "Driver" },
  { value: "4", label: "Safety Officer" },
  { value: "5", label: "Financial Analyst" },
];

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const payload = {
        role_id: parseInt(values.roleId, 10),
        full_name: values.fullName,
        email: values.email,
        phone: values.phone || null,
        is_active: true,
        password: values.password,
      };

      await signup(payload);
      
      setStatusType("success");
      setStatusMessage("Account created successfully! Redirecting to login...");
      toast.success("Account created successfully!");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      const errorMsg = getApiErrorMessage(error, "Failed to register account.");
      setStatusType("error");
      setStatusMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        error={errors.fullName?.message}
        leftIcon={<User size={16} />}
        {...register("fullName")}
      />

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
        label="Phone Number (Optional)"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phone?.message}
        leftIcon={<Phone size={16} />}
        {...register("phone")}
      />

      <Select
        label="Operational Role"
        options={ROLE_OPTIONS}
        error={errors.roleId?.message}
        leftIcon={<Briefcase size={16} />}
        {...register("roleId")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Create a strong password"
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

      <Input
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        leftIcon={<Lock size={16} />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("confirmPassword")}
      />

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting} loading={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign up"}
      </Button>

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
