export type MessageResponse = { message: string };

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type Gender = "male" | "female";
export type RoomRule = "no_smoking" | "no_pets" | "keep_quiet" | "keep_tidy";

export type Contacts = {
  telegram: string | null;
  whatsapp: string | null;
  phone: string | null;
};

export type Habits = {
  smokes: boolean | null;
  hasPets: boolean | null;
  isTidy: boolean | null;
};

export type Profile = {
  name: string | null;
  gender: Gender | null;
  contacts: Contacts;
  lookingForRoommate: boolean;
  about: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  habits: Habits;
};

export type User = {
  id: number;
  email: string;
  createdAt: string;
  profile: Profile;
};

export type ProfileInput = Profile;

export type RoomInput = {
  city: string;
  region: string;
  approximateAddress: string;
  price: number;
  roomsCount: number;
  floor: number;
  bathroomsCount: number;
  roommatesCount: number;
  gender: Gender;
  description: string;
  rules: RoomRule[];
  otherRules: string | null;
  taken: boolean;
};

export type RoomSummary = {
  id: number;
  city: string;
  region: string;
  price: number;
  roomsCount: number;
  floor: number;
  roommatesCount: number;
  gender: Gender;
  publishedAt: string;
};

export type MyRoomSummary = RoomSummary & {
  taken: boolean;
  viewsCount: number;
};

export type PublicProfile = {
  userId: number;
  name: string;
  gender: Gender;
  about: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  habits: Habits;
  contacts: Contacts;
};

export type RoomDetails = RoomInput & {
  id: number;
  publishedAt: string;
  viewsCount: number;
  isOwner: boolean;
  owner: PublicProfile;
};

export type RoommateSummary = {
  userId: number;
  name: string;
  gender: Gender;
  about: string | null;
  minPrice: number | null;
  maxPrice: number | null;
};

export type ItemsResponse<T> = { items: T[] };

export const emptyContacts = (): Contacts => ({
  telegram: null,
  whatsapp: null,
  phone: null,
});

export const emptyHabits = (): Habits => ({
  smokes: null,
  hasPets: null,
  isTidy: null,
});

export const emptyProfile = (): Profile => ({
  name: null,
  gender: null,
  contacts: emptyContacts(),
  lookingForRoommate: false,
  about: null,
  minPrice: null,
  maxPrice: null,
  habits: emptyHabits(),
});
