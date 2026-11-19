export const config = {
  appName: "Roomi",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  apiPrefix: "/api",
  tokenStorageKey: "access_token",
  fakeStorageKey: "fake123",
  useFakeApi: process.env.NEXT_PUBLIC_USE_FAKE_API !== "false",
};

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  confirm: "/confirm",
  profile: "/profile",
  myRooms: "/my-rooms",
  createRoom: "/rooms/new",
  rooms: "/rooms",
  roommates: "/roommates",
};

export function safeReturnTo(value: string | null | undefined, fallback = routes.home) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
