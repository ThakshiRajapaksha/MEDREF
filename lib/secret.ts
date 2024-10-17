// lib/secret.ts
const globalForSecret = global as unknown as { JWT_SECRET: string | undefined };

export const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error(
    'JWT secret is not defined. Set the JWT_SECRET environment variable.'
  );
}

// In development, keep the secret in the global object to avoid multiple loads
if (process.env.NODE_ENV !== 'production') {
  if (!globalForSecret.JWT_SECRET) {
    globalForSecret.JWT_SECRET = SECRET_KEY;
  }
}
