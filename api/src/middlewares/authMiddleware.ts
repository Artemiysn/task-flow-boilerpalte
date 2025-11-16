import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

// Расширяем тип Request, чтобы добавить user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Middleware для проверки JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Получаем токен из заголовка
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  // Проверяем токен
  jwt.verify(token, authConfig.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Неверный или истекший токен' });
    }
    
    // Добавляем данные пользователя в request
    req.user = decoded as { userId: string; email: string };
    next();
  });
};

// Можно добавить middleware для проверки конкретных ролей
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // В будущем можно добавить роли в токен
  next();
};