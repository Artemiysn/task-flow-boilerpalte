import { getPostgresClient } from '../connections/postgres';

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

export class UserRepository {
  // Создание пользователя
  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const client = getPostgresClient();
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await client.query(query, [
      userData.email,
      userData.password_hash,
      userData.first_name,
      userData.last_name
    ]);
    
    return result.rows[0];
  }

  // Поиск по email
  static async findByEmail(email: string): Promise<User | null> {
    const client = getPostgresClient();
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    
    const result = await client.query(query, [email]);
    return result.rows[0] || null;
  }
}