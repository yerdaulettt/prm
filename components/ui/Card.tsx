export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="w-full max-w-sm space-y-5 rounded-lg border border-foreground/15 p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      {children}
    </section>
  );
}
