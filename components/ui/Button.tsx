import Link from "next/link";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:opacity-85",
  secondary: "border border-foreground/25 hover:bg-foreground/5",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
