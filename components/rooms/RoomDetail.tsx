import Link from "next/link";
import type { RoomDetails } from "@/types/api";
import { ButtonLink } from "@/components/ui/Button";

const ruleLabels: Record<string, string> = {
  no_smoking: "No smoking", no_pets: "No pets", keep_quiet: "Keep quiet", keep_tidy: "Keep tidy",
};

export function RoomDetail({ room, onDelete, deleting = false }: { room: RoomDetails; onDelete?: () => void; deleting?: boolean }) {
  const owner = room.owner;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="space-y-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/55">{room.city}, {room.region}</p>
            <h1 className="mt-1 text-2xl font-semibold">Room in {room.city}</h1>
            <p className="mt-1 text-sm text-foreground/55">{room.approximateAddress}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">{room.price.toLocaleString()}</p>
            <p className="text-xs text-foreground/55">per roommate / month</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Rooms" value={room.roomsCount} />
          <Metric label="Floor" value={room.floor} />
          <Metric label="Bathrooms" value={room.bathroomsCount} />
          <Metric label="Roommates wanted" value={room.roommatesCount} />
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">About this place</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/75">{room.description}</p>
        </div>
        {(room.rules.length > 0 || room.otherRules) && (
          <div className="space-y-2">
            <h2 className="font-semibold">House rules</h2>
            <div className="flex flex-wrap gap-2">{room.rules.map((rule) => <span key={rule} className="rounded-full bg-[#f4f2ed] px-3 py-1.5 text-xs">{ruleLabels[rule] ?? rule}</span>)}</div>
            {room.otherRules && <p className="text-sm text-foreground/70">{room.otherRules}</p>}
          </div>
        )}
        <div className="flex flex-wrap gap-3 border-t border-foreground/10 pt-4 text-xs text-foreground/50">
          <span>Posted {new Date(room.publishedAt).toLocaleDateString()}</span>
          <span>{room.viewsCount.toLocaleString()} views</span>
          <span>{room.gender === "male" ? "Male" : "Female"} roommates preferred</span>
        </div>
        {room.isOwner && (
          <div className="flex flex-wrap gap-3 border-t border-foreground/10 pt-4">
            <ButtonLink href={`/rooms/${room.id}/edit`}>Edit listing</ButtonLink>
            <button type="button" onClick={onDelete} disabled={deleting} className="rounded-lg border border-red-600/30 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">{deleting ? "Deleting…" : "Delete listing"}</button>
          </div>
        )}
      </section>
      <aside className="h-fit space-y-4 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/45">Room owner</p>
          <h2 className="mt-2 text-xl font-semibold">{owner.name}</h2>
          <p className="text-sm text-foreground/55">{owner.gender === "male" ? "Male" : "Female"}</p>
        </div>
        {owner.about && <p className="text-sm leading-6 text-foreground/75">{owner.about}</p>}
        <div className="space-y-2 border-t border-foreground/10 pt-4">
          <h3 className="text-sm font-semibold">Contact</h3>
          {owner.contacts.telegram && <ContactLine label="Telegram" value={`@${owner.contacts.telegram}`} href={`https://t.me/${encodeURIComponent(owner.contacts.telegram)}`} />}
          {owner.contacts.whatsapp && <ContactLine label="WhatsApp" value={owner.contacts.whatsapp} href={`https://wa.me/${owner.contacts.whatsapp.replace(/\D/g, "")}`} />}
          {owner.contacts.phone && <ContactLine label="Phone" value={owner.contacts.phone} href={`tel:${owner.contacts.phone}`} />}
        </div>
        <p className="text-xs text-foreground/45">Only the owner’s public profile and contact details are shown. Account email is private.</p>
        <Link href="/" className="text-sm underline underline-offset-4">Back to rooms</Link>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-[#f6f5f1] p-3"><p className="text-xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-foreground/55">{label}</p></div>;
}
function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return <p className="flex items-center justify-between gap-3 text-sm"><span className="text-foreground/55">{label}</span><a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="font-medium underline underline-offset-4">{value}</a></p>;
}
