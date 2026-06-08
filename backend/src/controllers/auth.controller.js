const authService = require("../services/auth.service");
const { env } = require("../config/env");

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    maxAge: env.cookieMaxAgeMs,
    path: "/",
  });
}

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    setAuthCookie(res, token);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.body);
    setAuthCookie(res, token);
    return res.status(200).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: "/",
  });
  return res.status(200).json({ message: "Logged out" });
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.auth.userId);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, logout, me };

