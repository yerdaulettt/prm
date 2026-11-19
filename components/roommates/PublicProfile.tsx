import type { PublicProfile as PublicProfileType } from "@/types/api";

export function PublicProfile({ profile }: { profile: PublicProfileType }) {
  const habitItems = [
    ["Smokes", profile.habits.smokes], ["Has pets", profile.habits.hasPets], ["Keeps tidy", profile.habits.isTidy],
  ] as const;
  const hours = (from: number | null, to: number | null) => from == null || to == null ? "Not specified" : `${String(from).padStart(2, "0")}:00 – ${String(to).padStart(2, "0")}:00`;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-5 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#e8eee5] text-2xl font-semibold">{profile.name.slice(0, 1).toUpperCase()}</div>
          <div><h1 className="text-2xl font-semibold">{profile.name}</h1><p className="text-sm capitalize text-foreground/55">{profile.gender}</p></div>
        </div>
        <div><h2 className="font-semibold">About</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/70">{profile.about || "No introduction added yet."}</p></div>
        <div><h2 className="font-semibold">Monthly budget</h2><p className="mt-2 text-sm text-foreground/70">{profile.minPrice != null && profile.maxPrice != null ? `${profile.minPrice.toLocaleString()} – ${profile.maxPrice.toLocaleString()}` : "Not specified"}</p></div>
        <div><h2 className="font-semibold">Living habits</h2><dl className="mt-2 grid gap-3 sm:grid-cols-2">
          {habitItems.map(([label, value]) => <div key={label} className="rounded-xl bg-[#f6f5f1] p-3"><dt className="text-xs text-foreground/50">{label}</dt><dd className="mt-1 text-sm font-medium">{value == null ? "Not specified" : value ? "Yes" : "No"}</dd></div>)}
        </dl></div>
      </section>
      <aside className="h-fit space-y-4 rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Contact details</h2>
        {profile.contacts.telegram && <Contact label="Telegram" value={`@${profile.contacts.telegram}`} href={`https://t.me/${encodeURIComponent(profile.contacts.telegram)}`} />}
        {profile.contacts.whatsapp && <Contact label="WhatsApp" value={profile.contacts.whatsapp} href={`https://wa.me/${profile.contacts.whatsapp.replace(/\D/g, "")}`} />}
        {profile.contacts.phone && <Contact label="Phone" value={profile.contacts.phone} href={`tel:${profile.contacts.phone}`} />}
        {!Object.values(profile.contacts).some(Boolean) && <p className="text-sm text-foreground/55">No contact details are available.</p>}
        <p className="border-t border-foreground/10 pt-3 text-xs text-foreground/45">This is a public profile. Private account details such as email are not shared.</p>
      </aside>
    </div>
  );
}
function Contact({ label, value, href }: { label: string; value: string; href: string }) {
  return <p className="flex flex-wrap justify-between gap-2 text-sm"><span className="text-foreground/55">{label}</span><a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="font-medium underline underline-offset-4">{value}</a></p>;
}
