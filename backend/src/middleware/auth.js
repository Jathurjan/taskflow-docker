import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized, token missing');
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws on invalid/expired

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'Not authorized, user no longer exists');

  req.user = user;
  next();
});
