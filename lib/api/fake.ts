import { config } from "@/lib/config";
import { ApiError } from "@/lib/api/errors";
import type {
  Contacts, Habits, LoginResponse, MyRoomSummary, Profile,
  ProfileInput, PublicProfile, RoomDetails, RoomInput, RoomRule, RoomSummary,
  RoommateSummary, User,
} from "@/types/api";
import { emptyProfile } from "@/types/api";

type FakeUser = User & { password: string; confirmed: boolean; confirmationToken: string };
type FakeRoom = RoomInput & { id: number; ownerId: number; publishedAt: string; viewsCount: number };
type FakeState = { users: FakeUser[]; rooms: FakeRoom[]; nextUserId: number; nextRoomId: number; tokens: Record<string, number> };
type FakeOptions = { method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; token: string | null; signal?: AbortSignal };

const DEMO_EMAIL = "demo@test.com";
const DEMO_PASSWORD = "demo";

function seedState(): FakeState {
  const user1Profile: Profile = {
    name: "User 1",
    gender: "male",
    contacts: { telegram: "user1", whatsapp: null, phone: null },
    lookingForRoommate: true,
    about: "...",
    minPrice: 40000,
    maxPrice: 70000,
    habits: { smokes: false, hasPets: null, isTidy: true},
  };
  const user2Profile: Profile = {
    name: "User 2",
    gender: "female",
    contacts: { telegram: "user2", whatsapp: null, phone: null },
    lookingForRoommate: true,
    about: "...",
    minPrice: 30000,
    maxPrice: 40000,
    habits: { smokes: false, hasPets: false, isTidy: true},
  };
  const user3Profile: Profile = {
    name: "User 3",
    gender: "male",
    contacts: { telegram: null, whatsapp: "+123", phone: null },
    lookingForRoommate: false,
    about: "...",
    minPrice: null,
    maxPrice: null,
    habits: { smokes: false, hasPets: true, isTidy: null },
  };
  const baseDate = Date.now();
  return {
    users: [
      { id: 1, email: DEMO_EMAIL, createdAt: new Date(baseDate - 86400000 * 28).toISOString(), profile: user1Profile, password: DEMO_PASSWORD, confirmed: true, confirmationToken: "" },
      { id: 2, email: "user1@test.com", createdAt: new Date(baseDate - 86400000 * 18).toISOString(), profile: user2Profile, password: "user1", confirmed: true, confirmationToken: "" },
      { id: 3, email: "user2@test.com", createdAt: new Date(baseDate - 86400000 * 9).toISOString(), profile: user3Profile, password: "user2", confirmed: true, confirmationToken: "" },
    ],
    rooms: [
      { id: 12, ownerId: 2, city: "Almaty", region: "Almaly", approximateAddress: "..", price: 45000, roomsCount: 3, floor: 4, bathroomsCount: 1, roommatesCount: 2, gender: "male", description: "...", rules: ["no_smoking", "keep_tidy"], otherRules: "..", taken: false, publishedAt: new Date(baseDate - 86400000 * 2).toISOString(), viewsCount: 37 },
      { id: 13, ownerId: 1, city: "Almaty", region: "Almaly", approximateAddress: "...", price: 52000, roomsCount: 2, floor: 2, bathroomsCount: 1, roommatesCount: 1, gender: "female", description: "..", rules: ["no_smoking", "keep_quiet"], otherRules: null, taken: false, publishedAt: new Date(baseDate - 86400000 * 1).toISOString(), viewsCount: 14 },
      { id: 14, ownerId: 3, city: "Almaty", region: "Almaly", approximateAddress: "..", price: 39000, roomsCount: 3, floor: 1, bathroomsCount: 2, roommatesCount: 1, gender: "male", description: "..", rules: ["keep_tidy"], otherRules: "..", taken: true, publishedAt: new Date(baseDate - 86400000 * 4).toISOString(), viewsCount: 5 },
    ],
    nextUserId: 4,
    nextRoomId: 15,
    tokens: {},
  };
}

let memoryState: FakeState | null = null;

function readState(): FakeState {
  if (typeof window === "undefined") return memoryState ?? (memoryState = seedState());
  let raw: string | null = null;
  let storageAvailable = true;
  try {
    raw = window.localStorage.getItem(config.fakeStorageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as FakeState;
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.rooms) && parsed.tokens) {
        memoryState = parsed;
        return parsed;
      }
    }
  } catch {
    storageAvailable = false;
  }
  if (!storageAvailable && memoryState) return memoryState;
  memoryState = seedState();
  writeState(memoryState);
  return memoryState;
}

function writeState(state: FakeState) {
  memoryState = state;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(config.fakeStorageKey, JSON.stringify(state)); } catch {}
  }
}

function fail(status: number, message: string, errors?: Record<string, string>): never {
  throw new ApiError(status, message, errors ?? {});
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown): string | null {
  const result = cleanString(value);
  return result || null;
}

function getCurrentUser(state: FakeState, token: string | null, required = true): FakeUser | null {
  if (!token) {
    if (required) fail(401, "Authentication is required.");
    return null;
  }
  const userId = state.tokens[token];
  const user = state.users.find((item) => item.id === userId);
  if (!user) {
    if (required) fail(401, "Your session is invalid. Please log in again.");
    return null;
  }
  return user;
}

function publicProfile(user: FakeUser) {
  return {
    userId: user.id,
    name: user.profile.name ?? "",
    gender: user.profile.gender ?? "male",
    about: user.profile.about,
    minPrice: user.profile.minPrice,
    maxPrice: user.profile.maxPrice,
    habits: user.profile.habits,
    contacts: user.profile.contacts,
  } as PublicProfile;
}

function roomSummary(room: FakeRoom): RoomSummary {
  const { id, city, region, price, roomsCount, floor, roommatesCount, gender, publishedAt } = room;
  return { id, city, region, price, roomsCount, floor, roommatesCount, gender, publishedAt };
}

function roomDetails(state: FakeState, room: FakeRoom, callerId: number, countView: boolean): RoomDetails {
  if (countView) room.viewsCount += 1;
  const owner = state.users.find((user) => user.id === room.ownerId);
  if (!owner) fail(404, "Room not found.");
  const { id, ownerId: _ownerId, publishedAt, viewsCount, ...input } = room;
  return { ...input, id, publishedAt, viewsCount, isOwner: callerId === room.ownerId, owner: publicProfile(owner) };
}

function validateProfile(inputValue: unknown): { value: ProfileInput; errors: Record<string, string> } {
  const input = record(inputValue);
  const contactsInput = record(input.contacts);
  const habitsInput = record(input.habits);
  const errors: Record<string, string> = {};
  const name = cleanString(input.name);
  const gender = input.gender;
  for (const key of ["telegram", "whatsapp", "phone"] as const) {
    if (contactsInput[key] != null && typeof contactsInput[key] !== "string") errors[`contacts.${key}`] = "Contact value must be text.";
  }
  const contacts: Contacts = {
    telegram: nullableString(contactsInput.telegram),
    whatsapp: nullableString(contactsInput.whatsapp),
    phone: nullableString(contactsInput.phone),
  };
  const habits: Habits = {
    smokes: typeof habitsInput.smokes === "boolean" ? habitsInput.smokes : null,
    hasPets: typeof habitsInput.hasPets === "boolean" ? habitsInput.hasPets : null,
    isTidy: typeof habitsInput.isTidy === "boolean" ? habitsInput.isTidy : null,
  };
  const minPrice = input.minPrice === null || input.minPrice === "" || input.minPrice === undefined ? null : Number(input.minPrice);
  const maxPrice = input.maxPrice === null || input.maxPrice === "" || input.maxPrice === undefined ? null : Number(input.maxPrice);
  if (name.length < 2 || name.length > 50) errors.name = "Name must be between 2 and 50 characters.";
  if (gender !== "male" && gender !== "female") errors.gender = "Choose a valid gender.";
  if (!contacts.telegram && !contacts.whatsapp && !contacts.phone) errors.contacts = "Add at least one contact method.";
  if (contacts.telegram && !/^[A-Za-z0-9_]{5,32}$/.test(contacts.telegram)) errors["contacts.telegram"] = "Telegram username must contain 5–32 letters, digits or underscores, without @.";
  for (const key of ["whatsapp", "phone"] as const) {
    if (contacts[key] && !/^\+[1-9]\d{7,14}$/.test(contacts[key]!)) errors[`contacts.${key}`] = "Use international format, for example +15550100123.";
  }
  if (input.lookingForRoommate !== undefined && typeof input.lookingForRoommate !== "boolean") errors.lookingForRoommate = "Choose yes or no.";
  const validatePrice = (value: number | null, key: string) => {
    if (value !== null && (!Number.isInteger(value) || value < 1 || value > 1_000_000 || typeof input[key] !== "number")) errors[key] = "Enter a whole number between 1 and 1,000,000.";
  };
  validatePrice(minPrice, "minPrice"); validatePrice(maxPrice, "maxPrice");
  if ((minPrice === null) !== (maxPrice === null)) errors.minPrice = errors.maxPrice = "Set both budget limits or leave both empty.";
  if (minPrice !== null && maxPrice !== null && maxPrice < minPrice) errors.maxPrice = "Maximum budget must not be less than minimum budget.";
  if (input.about != null && typeof input.about !== "string") errors.about = "About must be text.";
  if (input.about != null && cleanString(input.about).length > 1000) errors.about = "About must be 1,000 characters or fewer.";
  for (const key of ["smokes", "hasPets", "isTidy"] as const) {
    if (habitsInput[key] != null && typeof habitsInput[key] !== "boolean") errors[`habits.${key}`] = "Choose yes, no, or not specified.";
  }
  const value: ProfileInput = {
    name: name || null,
    gender: gender === "male" || gender === "female" ? gender : null,
    contacts,
    lookingForRoommate: input.lookingForRoommate === true,
    about: input.about === undefined ? null : nullableString(input.about),
    minPrice: Number.isFinite(minPrice) ? minPrice : null,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : null,
    habits,
  };
  return { value, errors };
}

function validateRoom(inputValue: unknown): { value: RoomInput; errors: Record<string, string> } {
  const input = record(inputValue);
  const errors: Record<string, string> = {};
  const text = (key: string) => cleanString(input[key]);
  const number = (key: string) => typeof input[key] === "number" ? input[key] as number : Number.NaN;
  const range = (key: string, min: number, max: number, label: string) => {
    const value = number(key);
    if (!Number.isInteger(value) || value < min || value > max) errors[key] = `${label} must be a whole number from ${min} to ${max}.`;
    return value;
  };
  const city = text("city"); const region = text("region"); const approximateAddress = text("approximateAddress");
  const description = text("description");
  if (city.length < 2 || city.length > 60) errors.city = "City must be 2–60 characters.";
  if (region.length < 2 || region.length > 60) errors.region = "Region must be 2–60 characters.";
  if (approximateAddress.length < 3 || approximateAddress.length > 150) errors.approximateAddress = "Approximate address must be 3–150 characters.";
  if (description.length < 10 || description.length > 2000) errors.description = "Description must be 10–2,000 characters.";
  const price = range("price", 1, 1_000_000, "Price");
  const roomsCount = range("roomsCount", 1, 20, "Rooms count");
  const floor = range("floor", 1, 100, "Floor");
  const bathroomsCount = range("bathroomsCount", 1, 10, "Bathrooms count");
  const roommatesCount = range("roommatesCount", 1, 10, "Roommates count");
  const gender = input.gender === "male" || input.gender === "female" ? input.gender : null;
  if (!gender) errors.gender = "Choose a valid gender.";
  const validRules: RoomRule[] = ["no_smoking", "no_pets", "keep_quiet", "keep_tidy"];
  const suppliedRules = input.rules;
  const rules = Array.isArray(suppliedRules) ? suppliedRules.filter((item): item is RoomRule => typeof item === "string" && validRules.includes(item as RoomRule)) : [];
  if (suppliedRules !== undefined && !Array.isArray(suppliedRules)) errors.rules = "Rules must be a list.";
  if (Array.isArray(suppliedRules) && rules.length !== suppliedRules.length) errors.rules = "Choose valid house rules.";
  if (Array.isArray(suppliedRules) && new Set(rules).size !== rules.length) errors.rules = "Rules must be unique.";
  if (input.otherRules != null && typeof input.otherRules !== "string") errors.otherRules = "Other rules must be text.";
  if (input.otherRules != null && text("otherRules").length > 500) errors.otherRules = "Other rules must be 500 characters or fewer.";
  if (input.taken !== undefined && typeof input.taken !== "boolean") errors.taken = "Taken must be true or false.";
  const value: RoomInput = {
    city, region, approximateAddress, price, roomsCount, floor, bathroomsCount, roommatesCount,
    gender: gender ?? "male", description, rules: [...new Set(rules)],
    otherRules: nullableString(input.otherRules), taken: input.taken === true,
  };
  return { value, errors };
}

function assertValid(errors: Record<string, string>) {
  if (Object.keys(errors).length) fail(400, "Validation failed", errors);
}

function normalizePath(path: string) {
  const [pathname, query = ""] = path.split("?");
  return { pathname: pathname.replace(/\/$/, ""), params: new URLSearchParams(query) };
}

export async function fakeApiFetch<T>(path: string, options: FakeOptions): Promise<T> {
  await Promise.resolve();
  const state = readState();
  const { method, body, token, signal } = options;
  if (signal?.aborted) throw new DOMException("The request was aborted.", "AbortError");
  const { pathname, params } = normalizePath(path);
  const input = record(body);

  if (pathname === "/auth/register" && method === "POST") {
    const email = cleanString(input.email).toLowerCase();
    const password = typeof input.password === "string" ? input.password : "";
    const errors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    assertValid(errors);
    if (state.users.some((user) => user.email.toLowerCase() === email)) fail(409, "This email is already registered.");
    const id = state.nextUserId++;
    const confirmationToken = `fake-confirm-${id}`;
    state.users.push({ id, email, createdAt: new Date().toISOString(), profile: emptyProfile(), password, confirmed: false, confirmationToken });
    writeState(state);
    return { message: `Account created. In fake mode, confirm it at /confirm?token=${confirmationToken}.` } as T;
  }

  if (pathname === "/auth/confirm" && method === "GET") {
    const confirmToken = params.get("token");
    const user = state.users.find((item) => item.confirmationToken === confirmToken && !!confirmToken);
    if (!user) fail(400, "This confirmation link is invalid or has expired.");
    user.confirmed = true; user.confirmationToken = ""; writeState(state);
    return { message: "Your email is confirmed. You can log in now." } as T;
  }

  if (pathname === "/auth/resend" && method === "POST") {
    const email = cleanString(input.email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, "Validation failed", { email: "Enter a valid email address." });
    return { message: "If this email can receive a confirmation link, one has been sent." } as T;
  }

  if (pathname === "/auth/login" && method === "POST") {
    const email = cleanString(input.email).toLowerCase();
    const password = typeof input.password === "string" ? input.password : "";
    const errors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    assertValid(errors);
    const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) fail(401, "Email or password is incorrect.");
    if (!user.confirmed) fail(403, "Please confirm your email before logging in.");
    const accessToken = `fake-access-${user.id}-${Date.now().toString(36)}`;
    state.tokens[accessToken] = user.id; writeState(state);
    const response: LoginResponse = { accessToken, tokenType: "Bearer", expiresIn: 86400 };
    return response as unknown as T;
  }

  if (pathname === "/users/me" && method === "GET") {
    const user = getCurrentUser(state, token);
    return { id: user!.id, email: user!.email, createdAt: user!.createdAt, profile: user!.profile } as T;
  }

  if (pathname === "/users/me" && method === "PUT") {
    const user = getCurrentUser(state, token);
    const result = validateProfile(body);
    assertValid(result.errors);
    user!.profile = result.value; writeState(state);
    return { id: user!.id, email: user!.email, createdAt: user!.createdAt, profile: user!.profile } as T;
  }

  if (pathname === "/rooms" && method === "GET") {
    const items = state.rooms.filter((room) => !room.taken).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).map(roomSummary);
    return { items } as T;
  }

  if (pathname === "/rooms" && method === "POST") {
    const user = getCurrentUser(state, token);
    if (!user!.profile.name || !Object.values(user!.profile.contacts).some(Boolean)) fail(409, "Complete your profile before publishing a room.");
    const result = validateRoom(body); assertValid(result.errors);
    const room: FakeRoom = { ...result.value, id: state.nextRoomId++, ownerId: user!.id, publishedAt: new Date().toISOString(), viewsCount: 0 };
    state.rooms.push(room); writeState(state);
    return roomDetails(state, room, user!.id, false) as T;
  }

  const roomMatch = pathname.match(/^\/rooms\/(\d+)$/);
  if (roomMatch) {
    const id = Number(roomMatch[1]);
    const room = state.rooms.find((item) => item.id === id);
    if (method === "GET") {
      const user = getCurrentUser(state, token);
      if (!room || (room.taken && room.ownerId !== user!.id)) fail(404, "Room not found.");
      const isOwner = room.ownerId === user!.id;
      const response = roomDetails(state, room, user!.id, !isOwner);
      writeState(state);
      return response as T;
    }
    if (method === "PUT") {
      const user = getCurrentUser(state, token);
      if (!room) fail(404, "Room not found.");
      if (room.ownerId !== user!.id) fail(403, "You are not the owner of this room.");
      const result = validateRoom(body); assertValid(result.errors);
      Object.assign(room, result.value); writeState(state);
      return roomDetails(state, room, user!.id, false) as T;
    }
    if (method === "DELETE") {
      const user = getCurrentUser(state, token);
      if (!room) fail(404, "Room not found.");
      if (room.ownerId !== user!.id) fail(403, "You are not the owner of this room.");
      state.rooms = state.rooms.filter((item) => item.id !== id); writeState(state);
      return undefined as T;
    }
  }

  if (pathname === "/users/me/rooms" && method === "GET") {
    const user = getCurrentUser(state, token);
    const items: MyRoomSummary[] = state.rooms.filter((room) => room.ownerId === user!.id)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((room) => ({ ...roomSummary(room), taken: room.taken, viewsCount: room.viewsCount }));
    return { items } as T;
  }

  if (pathname === "/roommates" && method === "GET") {
    const user = getCurrentUser(state, token);
    const items: RoommateSummary[] = state.users.filter((item) => item.id !== user!.id && item.profile.lookingForRoommate)
      .sort((a, b) => b.id - a.id)
      .map((item) => ({ userId: item.id, name: item.profile.name ?? "", gender: item.profile.gender ?? "male", about: item.profile.about, minPrice: item.profile.minPrice, maxPrice: item.profile.maxPrice }));
    return { items } as T;
  }

  const roommateMatch = pathname.match(/^\/roommates\/(\d+)$/);
  if (roommateMatch && method === "GET") {
    getCurrentUser(state, token);
    const user = state.users.find((item) => item.id === Number(roommateMatch[1]));
    if (!user || !user.profile.lookingForRoommate) fail(404, "Roommate profile not found.");
    return publicProfile(user) as T;
  }

  fail(404, "The requested API endpoint does not exist in the fake backend.");
}

export const fakeBackendInfo = {
  demoEmail: DEMO_EMAIL,
  demoPassword: DEMO_PASSWORD,
};
