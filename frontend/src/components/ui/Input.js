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
      <div className={`flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm transition-colors ${error ? "border-red-400" : "border-slate-200 focus-within:border-slate-400"}`}>
        {leftIcon ? <span className="mr-2 text-slate-400">{leftIcon}</span> : null}
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
});

export default Input;
