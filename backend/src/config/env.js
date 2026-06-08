require("dotenv").config();

const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET"];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Copy .env.example to .env and set all values before starting the server."
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieSameSite: process.env.COOKIE_SAME_SITE || "lax",
  cookieMaxAgeMs: Number(process.env.COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
  adminEmail: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
};

module.exports = { validateEnv, env };
