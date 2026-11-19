import Link from "next/link";
import type { RoomSummary } from "@/types/api";

export function RoomCard({ room }: { room: RoomSummary }) {
  return (
    <Link href={`/rooms/${room.id}`} className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold group-hover:underline">{room.city}, {room.region}</p>
            <p className="mt-1 text-sm text-foreground/55">{room.gender === "male" ? "Male roommates" : "Female roommates"}</p>
          </div>
          <p className="shrink-0 text-right text-lg font-semibold tabular-nums">{room.price.toLocaleString()}<span className="block text-xs font-normal text-foreground/50">per month</span></p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-foreground/65">
          <span className="rounded-full bg-[#f4f2ed] px-3 py-1">{room.roomsCount} rooms</span>
          <span className="rounded-full bg-[#f4f2ed] px-3 py-1">Floor {room.floor}</span>
          <span className="rounded-full bg-[#f4f2ed] px-3 py-1">{room.roommatesCount} roommate{room.roommatesCount === 1 ? "" : "s"} wanted</span>
        </div>
      </div>
      <p className="mt-5 text-xs text-foreground/45">Posted {new Date(room.publishedAt).toLocaleDateString()}</p>
    </Link>
  );
}
