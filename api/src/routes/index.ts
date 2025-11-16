import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

// Подключаем все маршруты
router.use('/auth', authRoutes);

export default router;