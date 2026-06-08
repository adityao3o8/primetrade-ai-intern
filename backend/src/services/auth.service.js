const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");

async function register({ name, email, password }) {
  email = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

  const role = env.adminEmail && email === env.adminEmail ? "admin" : "user";

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn,
  });

  return { user, token };
}

async function login({ email, password }) {
  email = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign(
    { role: user.role },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn,
    }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) throw new AppError("Unauthorized", 401);
  return user;
}

module.exports = { register, login, getCurrentUser };

