import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository, CreateUserInput } from '../repositories/userRepository';
import { authConfig } from '../config/auth';

export interface RegisterInput extends Omit<CreateUserInput, 'password'> {
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  token: string;
}

export class AuthService {
  // Регистрация
  static async register(data: RegisterInput): Promise<AuthResponse> {
    // Валидация
    if (data.password !== data.confirmPassword) {
      throw new Error('Пароли не совпадают');
    }
    
    if (data.password.length < 8) {
      throw new Error('Пароль должен быть минимум 8 символов');
    }
    
    // Проверяем существует ли пользователь

    const existingUser = await UserRepository.findByEmailWithPassword(data.email);

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    // Создаем пользователя
    const user = await UserRepository.create({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    });

    // Генерируем JWT
    // @ts-ignore
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    );
    
    return {
      user,
      token,
    };
  }

  // Вход
  static async login(data: LoginInput): Promise<AuthResponse> {
    const user = await UserRepository.findByEmailWithPassword(data.email);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    
    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Неверный email или пароль');
    }
    
    // Генерируем JWT
    // @ts-ignore
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    );
    
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      token,
    };
  }
}