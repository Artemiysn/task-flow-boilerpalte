import { createClient, RedisClientType } from 'redis';
import { config } from '../config/services_configs';

let redisClient: RedisClientType | null = null;

export const connectToRedis = async (): Promise<RedisClientType> => {
  if (redisClient) return redisClient;

  redisClient = createClient(config.redis);

  redisClient.on('error', (err) => {
    console.error('❌ Redis client error:', err);
  });

  redisClient.on('connect', () => {
    console.log('🔄 Подключение к Redis...');
  });

  await redisClient.connect();
    console.log('✅ Подключение к Redis установлено');
  return redisClient;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectToRedis first.');
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis отключен');
  }
};