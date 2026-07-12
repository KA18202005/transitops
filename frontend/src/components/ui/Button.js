import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { children, type = "button", disabled = false, loading = false, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.75 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,23,42,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none ${className}`.trim()}
      {...props}
    >
      {loading ? "Signing in..." : children}
    </button>
  );
});

export default Button;
