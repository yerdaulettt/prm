import Link from "next/link";

type Variant = "primary" | "secondary" | "danger" | "ghost";
const base = "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
const variants: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:opacity-85",
  secondary: "border border-foreground/20 bg-white hover:bg-foreground/5",
  danger: "bg-red-700 text-white hover:bg-red-800",
  ghost: "hover:bg-foreground/5",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href, variant = "primary", children, className = "",
}: { href: string; variant?: Variant; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}
