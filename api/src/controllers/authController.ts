import { Request, Response } from 'express';
import { AuthService, RegisterInput, LoginInput } from '../services/authService';
import { getPostgresClient } from '../connections/postgres';

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, first_name, last_name } = req.body;
    
    const result = await AuthService.register({
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
    });
    
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка регистрации';
    res.status(400).json({ error: message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await AuthService.login({ email, password });
    
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка входа';
    res.status(401).json({ error: message });
  }
};

// GET /api/auth/profile (защищенный)
export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user доступен благодаря middleware
    const userId = req.user!.userId;
    
    const client = getPostgresClient();
    const query = 'SELECT id, email, first_name, last_name, is_active, created_at FROM users WHERE id = $1';
    const result = await client.query(query, [userId]);
    
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
};