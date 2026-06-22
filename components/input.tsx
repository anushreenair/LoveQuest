interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-xl border border-white/10
          bg-white/5 px-4 py-3
          text-white placeholder:text-white/30
          backdrop-blur-sm
          transition-all duration-200
          focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20
          focus:scale-[1.01]
          ${error ? "border-red-500/50" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl border border-white/10
          bg-white/5 px-4 py-3
          text-white placeholder:text-white/30
          backdrop-blur-sm resize-none
          transition-all duration-200
          focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20
          focus:scale-[1.01]
          ${error ? "border-red-500/50" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
