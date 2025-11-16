import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateLogin, validateRegistration } from '../middlewares/validationMiddleware';
import { authLimiter } from '../middlewares/rateLimitMiddleware';

const router = Router();

// Публичные маршруты
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);

// Защищенные маршруты
router.get('/profile', authenticateToken, getProfile);

export default router;