export type MessageResponse = {
  message: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type User = {
  id: number | string;
  email: string;
  createdAt: string;
};
