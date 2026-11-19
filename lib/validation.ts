import type { ProfileInput, RoomInput, RoomRule } from "@/types/api";
import type { FieldErrors } from "@/lib/api/errors";

const TELEGRAM_RE = /^[A-Za-z0-9_]{5,32}$/;
const INTERNATIONAL_PHONE_RE = /^\+[1-9]\d{7,14}$/;
const ROOM_RULES: RoomRule[] = ["no_smoking", "no_pets", "keep_quiet", "keep_tidy"];

function validWholeNumber(value: number | null, min: number, max: number) {
  return value === null || (Number.isInteger(value) && value >= min && value <= max);
}

export function validateProfileInput(profile: ProfileInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = profile.name?.trim() ?? "";
  if (name.length < 2 || name.length > 50) errors.name = "Name must be between 2 and 50 characters.";
  if (profile.gender !== "male" && profile.gender !== "female") errors.gender = "Choose a gender.";

  const contacts = profile.contacts;
  const telegram = contacts.telegram?.trim() ?? "";
  const whatsapp = contacts.whatsapp?.trim() ?? "";
  const phone = contacts.phone?.trim() ?? "";
  if (!telegram && !whatsapp && !phone) errors.contacts = "Add at least one contact method.";
  if (telegram && !TELEGRAM_RE.test(telegram)) errors["contacts.telegram"] = "Use 5–32 letters, digits or underscores, without @.";
  if (whatsapp && !INTERNATIONAL_PHONE_RE.test(whatsapp)) errors["contacts.whatsapp"] = "Use international format, for example +15550100123.";
  if (phone && !INTERNATIONAL_PHONE_RE.test(phone)) errors["contacts.phone"] = "Use international format, for example +15550100123.";

  if (profile.about && profile.about.length > 1000) errors.about = "About must be 1,000 characters or fewer.";
  if (!validWholeNumber(profile.minPrice, 1, 1_000_000)) errors.minPrice = "Enter a whole number from 1 to 1,000,000.";
  if (!validWholeNumber(profile.maxPrice, 1, 1_000_000)) errors.maxPrice = "Enter a whole number from 1 to 1,000,000.";
  if ((profile.minPrice === null) !== (profile.maxPrice === null)) {
    errors.minPrice = "Set both budget limits or leave both empty.";
    errors.maxPrice = "Set both budget limits or leave both empty.";
  }
  if (profile.minPrice !== null && profile.maxPrice !== null && profile.maxPrice < profile.minPrice) {
    errors.maxPrice = "Maximum budget must not be less than minimum budget.";
  }
  return errors;
}

export function validateRoomInput(room: RoomInput): FieldErrors {
  const errors: FieldErrors = {};
  const city = room.city.trim();
  const region = room.region.trim();
  const address = room.approximateAddress.trim();
  const description = room.description.trim();
  if (city.length < 2 || city.length > 60) errors.city = "City must be 2–60 characters.";
  if (region.length < 2 || region.length > 60) errors.region = "Region must be 2–60 characters.";
  if (address.length < 3 || address.length > 150) errors.approximateAddress = "Approximate address must be 3–150 characters.";
  if (!validWholeNumber(room.price, 1, 1_000_000)) errors.price = "Price must be a whole number from 1 to 1,000,000.";
  if (!validWholeNumber(room.roomsCount, 1, 20)) errors.roomsCount = "Choose a whole number from 1 to 20.";
  if (!validWholeNumber(room.floor, 1, 100)) errors.floor = "Choose a whole number from 1 to 100.";
  if (!validWholeNumber(room.bathroomsCount, 1, 10)) errors.bathroomsCount = "Choose a whole number from 1 to 10.";
  if (!validWholeNumber(room.roommatesCount, 1, 10)) errors.roommatesCount = "Choose a whole number from 1 to 10.";
  if (room.gender !== "male" && room.gender !== "female") errors.gender = "Choose a gender.";
  if (description.length < 10 || description.length > 2000) errors.description = "Description must be 10–2,000 characters.";
  if (room.otherRules && room.otherRules.length > 500) errors.otherRules = "Other rules must be 500 characters or fewer.";
  if (room.rules.some((rule) => !ROOM_RULES.includes(rule))) errors.rules = "Choose valid house rules.";
  if (new Set(room.rules).size !== room.rules.length) errors.rules = "Choose each house rule only once.";
  return errors;
}
