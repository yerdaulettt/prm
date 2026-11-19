type AlertProps = {
  type: "error" | "success" | "info";
  children: React.ReactNode;
};

export function Alert({ type, children }: AlertProps) {
  const color = {
    error: "border-red-500/40 bg-red-50 text-red-800",
    success: "border-green-600/30 bg-green-50 text-green-800",
    info: "border-blue-500/30 bg-blue-50 text-blue-800",
  }[type];
  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${color}`}>
      {children}
    </div>
  );
}
