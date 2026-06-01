import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Reusable styled input for onboarding forms.
 */
export function FormField({
  label,
  error,
  className = "",
  id,
  ...props
}: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-pink-100/90"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={[
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white",
          "placeholder:text-pink-200/30",
          "outline-none transition-colors",
          "focus:border-pink-400/50 focus:bg-white/8 focus:ring-2 focus:ring-pink-500/20",
          error ? "border-red-400/60" : "border-white/15",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

/**
 * Reusable styled select for onboarding forms.
 */
export function FormSelect({
  label,
  error,
  options,
  placeholder = "Select an option",
  className = "",
  id,
  ...props
}: FormSelectProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-pink-100/90"
      >
        {label}
      </label>
      <select
        id={fieldId}
        className={[
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white",
          "outline-none transition-colors",
          "focus:border-pink-400/50 focus:bg-white/8 focus:ring-2 focus:ring-pink-500/20",
          error ? "border-red-400/60" : "border-white/15",
          !props.value && "text-pink-200/30",
          className,
        ].join(" ")}
        {...props}
      >
        <option value="" disabled className="bg-[#1a0a2e] text-pink-200/50">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[#1a0a2e] text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
