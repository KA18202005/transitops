import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    type = "text",
    placeholder,
    className = "",
    leftIcon,
    rightElement,
    id,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <div
        className={`flex items-center rounded-xl border bg-slate-50 px-3.5 py-3 shadow-sm transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50 shadow-red-100"
            : "border-slate-200 focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-md"
        }`}
      >
        {leftIcon ? <span className="mr-2.5 text-slate-400">{leftIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 ${className}`.trim()}
          {...props}
        />
        {rightElement ? <span className="ml-2">{rightElement}</span> : null}
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
});

export default Input;
