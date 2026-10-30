import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const sendAuth = (res, statusCode, user) =>
  res.status(statusCode).json({
    success: true,
    token: generateToken(user._id),
    user: userPayload(user),
  });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password });
  sendAuth(res, 201, user);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendAuth(res, 200, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: userPayload(req.user) });
});

// POST /api/auth/logout
// JWTs are stateless, so the client discards the token. This endpoint exists for a clean API contract.
export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
