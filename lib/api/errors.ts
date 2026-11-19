export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number;
  readonly errors: FieldErrors;

  constructor(status: number, message: string, errors: FieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function normalizeApiError(status: number, payload: unknown): ApiError {
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const message = typeof record.message === "string" && record.message.trim()
    ? record.message
    : "Something went wrong. Please try again.";

  const errors: FieldErrors = {};
  if (status === 400 && record.errors && typeof record.errors === "object" && !Array.isArray(record.errors)) {
    for (const [key, value] of Object.entries(record.errors as Record<string, unknown>)) {
      if (typeof value === "string") errors[key] = value;
    }
  }

  return new ApiError(status, message, errors);
}

export function fieldError(errors: FieldErrors | undefined, ...keys: string[]) {
  if (!errors) return undefined;
  for (const key of keys) {
    if (errors[key]) return errors[key];
  }
  return undefined;
}
