type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function FormField({ label, id, error, hint, className = "", ...props }: FormFieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium">{label}</label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-foreground/60 focus:ring-2 focus:ring-foreground/10 ${error ? "border-red-500" : "border-foreground/20"} ${className}`}
        {...props}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-foreground/55">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
