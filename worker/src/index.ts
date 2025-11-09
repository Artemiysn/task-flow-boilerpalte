import express from 'express';
import { Client } from 'pg';
import { createClient as createRedisClient } from 'redis';
import amqp from 'amqplib';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

async function waitForConnection(
  name: string,
  connectFn: () => Promise<void>,
  maxRetries = 10,
  delay = 5000
): Promise<void> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await connectFn();
      console.log(`✅ Успешно подключено к ${name}`);
      return;
    } catch (error) {
      retries++;
      console.log(`⏳ Попытка подключения к ${name} (${retries}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Не удалось подключиться к ${name} после ${maxRetries} попыток`);
}

async function connectToPostgres(): Promise<void> {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  
  await client.connect();
  await client.end();
}

async function connectToRedis(): Promise<void> {
  const client = createRedisClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });
  
  await client.connect();
  await client.disconnect();
}

async function connectToRabbitMQ(): Promise<void> {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST,
    port: parseInt(process.env.RABBITMQ_PORT || '5672'),
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS,
  });
  await connection.close();
}

async function initializeConnections() {
  console.log('Запуск Worker сервиса...');
  
  try {
    await waitForConnection('Postgres', connectToPostgres);
    await waitForConnection('Redis', connectToRedis);
    await waitForConnection('RabbitMQ', connectToRabbitMQ);
    
    console.log('\n🚀 Все подключения установлены. Worker готов к работе!\n');
  } catch (error) {
    console.error('❌ Ошибка при инициализации подключений:', error);
    process.exit(1);
  }
}

// Инициализация подключений при запуске
initializeConnections();

// Бесконечный цикл для имитации работы воркера
setInterval(() => {
  console.log('Worker: ожидание задач...');
}, 30000);