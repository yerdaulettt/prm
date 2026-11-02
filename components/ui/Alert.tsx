type AlertProps = {
  type: "error" | "success";
  children: React.ReactNode;
};

export function Alert({ type, children }: AlertProps) {
  const color =
    type === "error"
      ? "border-red-500/50 bg-red-50 text-red-700"
      : "border-green-500/50 bg-green-50 text-green-700";

  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-md border px-3 py-2 text-sm ${color}`}>
      {children}
    </div>
  );
}
