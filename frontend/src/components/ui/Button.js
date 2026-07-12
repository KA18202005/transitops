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
      className={`inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 ${className}`.trim()}
      {...props}
    >
      {loading ? "Signing in..." : children}
    </button>
  );
});

export default Button;
