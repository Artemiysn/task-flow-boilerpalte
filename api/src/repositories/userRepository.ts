import { getPostgresClient } from '../connections/postgres';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Для регистрации нам нужен тип с паролем, а не хешем
export interface CreateUserInput {
  email: string;
  password: string; // Пароль в открытом виде
  first_name?: string;
  last_name?: string;
}

export class UserRepository {
  // Создание пользователя с хешированием пароля
  static async create(userData: CreateUserInput): Promise<Omit<User, 'password_hash'>> {
    const client = getPostgresClient();
    
    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, is_active, created_at, updated_at
    `;
    
    const result = await client.query(query, [
      userData.email,
      passwordHash,
      userData.first_name,
      userData.last_name
    ]);
    
    return result.rows[0];
  }

  // Поиск по email (включает пароль для аутентификации)
  static async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
    const client = getPostgresClient();
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await client.query(query, [email]);
    return result.rows[0] || null;
  }

  // Публичный метод для получения пользователя (без пароля)
  static async findById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const client = getPostgresClient();
    const query = 'SELECT id, email, first_name, last_name, is_active, created_at, updated_at FROM users WHERE id = $1';
    
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  }
}