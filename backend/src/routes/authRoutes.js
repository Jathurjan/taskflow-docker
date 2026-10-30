import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const emailRule = body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address');

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  emailRule,
  body('password').isLength({ min: 6, max: 72 }).withMessage('Password must be between 6 and 72 characters'),
];

const loginRules = [emailRule, body('password').notEmpty().withMessage('Password is required')];

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
