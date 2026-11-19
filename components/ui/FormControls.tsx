type Shared = { label: string; name: string; error?: string; hint?: string };

export function TextAreaField({ label, name, error, hint, ...props }: Shared & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      <textarea id={name} name={name} aria-invalid={!!error} className={`min-h-28 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-foreground/60 focus:ring-2 focus:ring-foreground/10 ${error ? "border-red-500" : "border-foreground/20"}`} {...props} />
      {hint && !error && <p className="text-xs text-foreground/55">{hint}</p>}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function SelectField({ label, name, error, children, ...props }: Shared & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      <select id={name} name={name} aria-invalid={!!error} className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-foreground/60 focus:ring-2 focus:ring-foreground/10 ${error ? "border-red-500" : "border-foreground/20"}`} {...props}>{children}</select>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
