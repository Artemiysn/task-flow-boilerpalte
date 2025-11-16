import { Client } from 'pg';
import { config } from '../config/services_configs';

let postgresClient: Client | null = null;

export const connectToPostgres = async (): Promise<Client> => {
  if (postgresClient) return postgresClient;

  postgresClient = new Client(config.postgres);

  // Обработка ошибок подключения
  postgresClient.on('error', (err) => {
    console.error('❌ PostgreSQL client error:', err);
    // При ошибке клиента пробуем переподключиться
    setTimeout(async () => {
      console.log('🔄 Попытка переподключения к PostgreSQL...');
      postgresClient = null;
      await connectToPostgres();
    }, 5000);
  });

  await postgresClient.connect();
  console.log('✅ Подключение к PostgreSQL установлено');
  return postgresClient;
};

// Функция для получения клиента в других местах
export const getPostgresClient = (): Client => {
  if (!postgresClient) {
    throw new Error('PostgreSQL client not initialized. Call connectToPostgres first.');
  }
  return postgresClient;
};

// Graceful shutdown
export const disconnectPostgres = async () => {
  if (postgresClient) {
    await postgresClient.end();
    console.log('🔌 PostgreSQL отключен');
  }
};