type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FormField({ label, id, ...props }: FormFieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full rounded-md border border-foreground/25 bg-transparent px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-foreground"
        {...props}
      />
    </div>
  );
}
