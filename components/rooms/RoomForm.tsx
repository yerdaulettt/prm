"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roomsApi } from "@/lib/api/rooms";
import { ApiError, fieldError } from "@/lib/api/errors";
import { routes } from "@/lib/config";
import { validateRoomInput } from "@/lib/validation";
import type { Gender, RoomInput, RoomRule } from "@/types/api";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { SelectField, TextAreaField } from "@/components/ui/FormControls";

const ruleOptions: { value: RoomRule; label: string }[] = [
  { value: "no_smoking", label: "No smoking" },
  { value: "no_pets", label: "No pets" },
  { value: "keep_quiet", label: "Keep quiet" },
  { value: "keep_tidy", label: "Keep tidy" },
];

const emptyRoom: RoomInput = {
  city: "", region: "", approximateAddress: "", price: 0, roomsCount: 1, floor: 1,
  bathroomsCount: 1, roommatesCount: 1, gender: "male", description: "", rules: [], otherRules: null, taken: false,
};

type Props = { initialValue?: RoomInput; roomId?: number; mode: "create" | "edit" };

export function RoomForm({ initialValue, roomId, mode }: Props) {
  const router = useRouter();
  const [value, setValue] = useState<RoomInput>({ ...emptyRoom, ...initialValue, rules: initialValue?.rules ?? [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function update<K extends keyof RoomInput>(key: K, next: RoomInput[K]) {
    setValue((current) => ({ ...current, [key]: next }));
    setErrors((current) => { const copy = { ...current }; delete copy[key]; return copy; });
  }

  function updateNumber(key: "price" | "roomsCount" | "floor" | "bathroomsCount" | "roommatesCount", raw: string) {
    update(key, raw === "" ? 0 : Number(raw));
  }

  function toggleRule(rule: RoomRule, checked: boolean) {
    update("rules", checked ? [...value.rules, rule] : value.rules.filter((item) => item !== rule));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setMessage(""); setErrors({}); setProfileIncomplete(false); setIsSaving(true);
    const payload: RoomInput = {
      ...value,
      city: value.city.trim(), region: value.region.trim(), approximateAddress: value.approximateAddress.trim(),
      description: value.description.trim(), otherRules: value.otherRules?.trim() || null,
      rules: [...new Set(value.rules)],
    };
    const localErrors = validateRoomInput(payload);
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      setMessage("Please check the highlighted fields.");
      setIsSaving(false);
      return;
    }
    try {
      const saved = mode === "create"
        ? await roomsApi.create(payload)
        : await roomsApi.update(roomId!, payload);
      router.replace(`/rooms/${saved.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message); setErrors(error.errors);
        setProfileIncomplete(mode === "create" && error.status === 409);
      } else setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {message && <Alert type="error">{message}{profileIncomplete && <span> Add your name and at least one contact to your <ButtonLink href={routes.profile} variant="secondary" className="ml-2">profile</ButtonLink> first.</span>}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="City" name="city" required minLength={2} maxLength={60} value={value.city} onChange={(e) => update("city", e.target.value)} error={fieldError(errors, "city")} />
        <FormField label="Region / neighbourhood" name="region" required minLength={2} maxLength={60} value={value.region} onChange={(e) => update("region", e.target.value)} error={fieldError(errors, "region")} />
      </div>
      <FormField label="Approximate address" name="approximateAddress" required minLength={3} maxLength={150} value={value.approximateAddress} onChange={(e) => update("approximateAddress", e.target.value)} error={fieldError(errors, "approximateAddress")} hint="Describe a nearby landmark or street. Do not enter the exact address." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Monthly rent per roommate" name="price" type="number" min={1} max={1000000} step={1} required value={value.price || ""} onChange={(e) => updateNumber("price", e.target.value)} error={fieldError(errors, "price")} />
        <FormField label="Rooms in the home" name="roomsCount" type="number" min={1} max={20} step={1} required value={value.roomsCount} onChange={(e) => updateNumber("roomsCount", e.target.value)} error={fieldError(errors, "roomsCount")} />
        <FormField label="Floor" name="floor" type="number" min={1} max={100} step={1} required value={value.floor} onChange={(e) => updateNumber("floor", e.target.value)} error={fieldError(errors, "floor")} />
        <FormField label="Bathrooms" name="bathroomsCount" type="number" min={1} max={10} step={1} required value={value.bathroomsCount} onChange={(e) => updateNumber("bathroomsCount", e.target.value)} error={fieldError(errors, "bathroomsCount")} />
        <FormField label="Roommates wanted" name="roommatesCount" type="number" min={1} max={10} step={1} required value={value.roommatesCount} onChange={(e) => updateNumber("roommatesCount", e.target.value)} error={fieldError(errors, "roommatesCount")} />
        <SelectField label="Preferred roommate gender" name="gender" value={value.gender} onChange={(e) => update("gender", e.target.value as Gender)} error={fieldError(errors, "gender")}>
          <option value="male">Male</option><option value="female">Female</option>
        </SelectField>
      </div>
      <TextAreaField label="Description" name="description" minLength={10} maxLength={2000} required value={value.description} onChange={(e) => update("description", e.target.value)} error={fieldError(errors, "description")} hint={`${value.description.length}/2,000 characters`} />
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">House rules</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ruleOptions.map((rule) => (
            <label key={rule.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={value.rules.includes(rule.value)} onChange={(e) => toggleRule(rule.value, e.target.checked)} className="size-4 accent-black" />
              {rule.label}
            </label>
          ))}
        </div>
        {fieldError(errors, "rules") && <p className="text-xs text-red-700">{fieldError(errors, "rules")}</p>}
      </fieldset>
      <TextAreaField label="Other rules (optional)" name="otherRules" maxLength={500} value={value.otherRules ?? ""} onChange={(e) => update("otherRules", e.target.value || null)} error={fieldError(errors, "otherRules")} />
      {mode === "edit" && (
        <label className="flex items-center gap-3 rounded-xl border border-foreground/10 p-4 text-sm">
          <input type="checkbox" checked={value.taken} onChange={(e) => update("taken", e.target.checked)} className="size-4 accent-black" />
          <span><strong className="block">Room is taken</strong><span className="text-xs text-foreground/55">Taken rooms are hidden from the public room feed.</span>{fieldError(errors, "taken") && <span className="mt-1 block text-xs text-red-700">{fieldError(errors, "taken")}</span>}</span>
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : mode === "create" ? "Publish room" : "Save changes"}</Button>
        <ButtonLink href={mode === "edit" && roomId ? `/rooms/${roomId}` : routes.home} variant="secondary">Cancel</ButtonLink>
      </div>
    </form>
  );
}
