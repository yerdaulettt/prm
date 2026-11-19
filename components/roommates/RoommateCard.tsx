import Link from "next/link";
import type { RoommateSummary } from "@/types/api";

export function RoommateCard({ roommate }: { roommate: RoommateSummary }) {
  const budget = roommate.minPrice != null && roommate.maxPrice != null
    ? `${roommate.minPrice.toLocaleString()}–${roommate.maxPrice.toLocaleString()} / month`
    : "Budget not specified";
  return (
    <Link href={`/roommates/${roommate.userId}`} className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#e8eee5] text-lg font-semibold">{roommate.name.slice(0, 1).toUpperCase()}</div>
        <div><h2 className="font-semibold">{roommate.name}</h2><p className="text-xs capitalize text-foreground/55">{roommate.gender}</p></div>
      </div>
      <p className="mt-4 text-sm font-medium">{budget}</p>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/60">{roommate.about || "This person has not added an introduction yet."}</p>
      <p className="mt-4 text-xs font-medium underline underline-offset-4">View public profile</p>
    </Link>
  );
}
