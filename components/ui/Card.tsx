export function Card({
  title, children, className = "", wide = false,
}: { title: string; children: React.ReactNode; className?: string; wide?: boolean }) {
  return (
    <section className={`w-full ${wide ? "max-w-4xl" : "max-w-lg"} space-y-5 rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm sm:p-7 ${className}`}>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  );
}
