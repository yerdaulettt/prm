import { config } from "@/lib/config";

export default function HomePage() {
  return <h1 className="text-3xl font-semibold">Welcome to {config.appName}</h1>;
}
