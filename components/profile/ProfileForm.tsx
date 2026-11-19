"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError, fieldError } from "@/lib/api/errors";
import type { Profile, ProfileInput } from "@/types/api";
import { emptyProfile } from "@/types/api";
import { validateProfileInput } from "@/lib/validation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { SelectField, TextAreaField } from "@/components/ui/FormControls";

type Draft = {
  name: string; gender: "male" | "female" | ""; telegram: string; whatsapp: string; phone: string;
  lookingForRoommate: boolean; about: string; minPrice: string; maxPrice: string;
  smokes: string; hasPets: string; isTidy: string;
};

function toDraft(profile?: Profile | null): Draft {
  const value = profile ?? emptyProfile();
  return {
    name: value.name ?? "", gender: value.gender ?? "", telegram: value.contacts?.telegram ?? "",
    whatsapp: value.contacts?.whatsapp ?? "", phone: value.contacts?.phone ?? "",
    lookingForRoommate: !!value.lookingForRoommate, about: value.about ?? "",
    minPrice: value.minPrice == null ? "" : String(value.minPrice), maxPrice: value.maxPrice == null ? "" : String(value.maxPrice),
    smokes: value.habits?.smokes == null ? "" : String(value.habits.smokes),
    hasPets: value.habits?.hasPets == null ? "" : String(value.habits.hasPets),
    isTidy: value.habits?.isTidy == null ? "" : String(value.habits.isTidy),
  };
}
function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function booleanOrNull(value: string): boolean | null {
  return value === "true" ? true : value === "false" ? false : null;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { saveProfile } = useAuth();
  const [draft, setDraft] = useState<Draft>(() => toDraft(profile));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (["telegram", "whatsapp", "phone"].includes(String(key))) {
        delete next.contacts;
        delete next[`contacts.${String(key)}`];
      }
      if (["minPrice", "maxPrice"].includes(String(key))) { delete next.minPrice; delete next.maxPrice; }
      return next;
    });
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setMessage(""); setErrors({}); setSaved(false); setIsSaving(true);
    const payload: ProfileInput = {
      name: draft.name.trim() || null,
      gender: draft.gender || null,
      contacts: { telegram: draft.telegram.trim() || null, whatsapp: draft.whatsapp.trim() || null, phone: draft.phone.trim() || null },
      lookingForRoommate: draft.lookingForRoommate,
      about: draft.about.trim() || null,
      minPrice: numberOrNull(draft.minPrice), maxPrice: numberOrNull(draft.maxPrice),
      habits: {
        smokes: booleanOrNull(draft.smokes), hasPets: booleanOrNull(draft.hasPets), isTidy: booleanOrNull(draft.isTidy),
      },
    };
    const localErrors = validateProfileInput(payload);
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      setMessage("Please check the highlighted fields.");
      setIsSaving(false);
      return;
    }
    try {
      await saveProfile(payload);
      setSaved(true);
    } catch (error) {
      if (error instanceof ApiError) { setMessage(error.message); setErrors(error.errors); }
      else setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {message && <Alert type="error">{message}</Alert>}
      {saved && <Alert type="success">Your profile has been saved.</Alert>}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Basic information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" name="name" minLength={2} maxLength={50} required value={draft.name} onChange={(e) => update("name", e.target.value)} error={fieldError(errors, "name")} />
          <SelectField label="Gender" name="gender" value={draft.gender} onChange={(e) => update("gender", e.target.value as Draft["gender"])} error={fieldError(errors, "gender")}>
            <option value="">Choose…</option><option value="male">Male</option><option value="female">Female</option>
          </SelectField>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-foreground/10 p-4 text-sm">
          <input type="checkbox" checked={draft.lookingForRoommate} onChange={(e) => update("lookingForRoommate", e.target.checked)} className="size-4 accent-black" />
          <span><strong className="block">I am looking for a roommate</strong><span className="text-xs text-foreground/55">Turn this on to show your public profile in the roommate directory.</span></span>
        </label>
      </section>
      <section className="space-y-4">
        <div><h2 className="text-base font-semibold">Contact details</h2><p className="mt-1 text-xs text-foreground/55">At least one contact method is required. Do not include @ in Telegram usernames.</p></div>
        {fieldError(errors, "contacts") && <p className="text-xs text-red-700">{fieldError(errors, "contacts")}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Telegram username" name="telegram" minLength={5} maxLength={32} value={draft.telegram} onChange={(e) => update("telegram", e.target.value)} error={fieldError(errors, "contacts.telegram")} />
          <FormField label="WhatsApp number" name="whatsapp" type="tel" placeholder="+7777" value={draft.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} error={fieldError(errors, "contacts.whatsapp")} />
          <FormField label="Phone number" name="phone" type="tel" placeholder="+7777" value={draft.phone} onChange={(e) => update("phone", e.target.value)} error={fieldError(errors, "contacts.phone")} />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-base font-semibold">About you and budget</h2>
        <TextAreaField label="About" name="about" maxLength={1000} value={draft.about} onChange={(e) => update("about", e.target.value)} error={fieldError(errors, "about")} hint={`${draft.about.length}/1,000 characters`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Minimum monthly budget" name="minPrice" type="number" min={1} max={1000000} step={1} value={draft.minPrice} onChange={(e) => update("minPrice", e.target.value)} error={fieldError(errors, "minPrice")} />
          <FormField label="Maximum monthly budget" name="maxPrice" type="number" min={1} max={1000000} step={1} value={draft.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} error={fieldError(errors, "maxPrice")} />
        </div>
        <p className="text-xs text-foreground/50">Set both budget limits, or leave both empty. Values use the same currency as room listings.</p>
      </section>
      <section className="space-y-4">
        <div><h2 className="text-base font-semibold">Living habits</h2><p className="mt-1 text-xs text-foreground/55">These answers are optional. “Not specified” is different from “No”.</p></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <HabitSelect label="Do you smoke?" name="smokes" value={draft.smokes} onChange={(v) => update("smokes", v)} />
          <HabitSelect label="Do you have pets?" name="hasPets" value={draft.hasPets} onChange={(v) => update("hasPets", v)} />
          <HabitSelect label="Are you tidy?" name="isTidy" value={draft.isTidy} onChange={(v) => update("isTidy", v)} />
        </div>
      </section>
      <Button type="submit" disabled={isSaving}>{isSaving ? "Saving profile…" : "Save profile"}</Button>
    </form>
  );
}

function HabitSelect({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (value: string) => void }) {
  return (
    <SelectField label={label} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value=""></option><option value="true">Yes</option><option value="false">No</option>
    </SelectField>
  );
}
