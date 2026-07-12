import { forwardRef } from "react";

const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    className = "",
    leftIcon,
    id,
    ...props
  },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
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
        <select
          ref={ref}
          id={selectId}
          className={`w-full border-0 bg-transparent text-sm text-slate-900 outline-none focus:ring-0 ${className}`.trim()}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
});

export default Select;
