import { connectToPostgres, disconnectPostgres } from './postgres';
import { connectToRedis, disconnectRedis } from './redis';
import { connectToRabbitMQ, disconnectRabbitMQ } from './rabbitmq';

async function waitForConnection(
  name: string,
  connectFn: () => Promise<any>,
  maxRetries = 10,
  delay = 5000
): Promise<void> {
  let retries = 0;
  while (retries < maxRetries ) {
    try {
      await connectFn();
      console.log(`✅ Успешно подключено к ${name}`);
      return;
    } catch (error) {
      console.log('ERROR');
      console.log(error);
      retries++;
      console.log(`⏳ Попытка подключения к ${name} (${retries}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Не удалось подключиться к ${name} после ${maxRetries} попыток`);
}

export async function initializeConnections() {
  console.log('Запуск API сервиса...');
  
  try {
    await waitForConnection('Postgres', connectToPostgres);
    await waitForConnection('Redis', connectToRedis);
    await waitForConnection('RabbitMQ', connectToRabbitMQ);
    
    console.log('\n🚀 Все подключения установлены. API готов к работе!\n');
  } catch (error) {
    console.error('❌ Ошибка при инициализации подключений:', error);
    process.exit(1);
  }
}

// Graceful shutdown для всех подключений
export const shutdownConnections = async () => {
  console.log('🛑 Завершение работы, отключение от сервисов...');
  
  await Promise.all([
    disconnectPostgres().catch(e => console.error('Ошибка отключения Postgres:', e)),
    disconnectRedis().catch(e => console.error('Ошибка отключения Redis:', e)),
    disconnectRabbitMQ().catch(e => console.error('Ошибка отключения RabbitMQ:', e))
  ]);
  
  console.log('👋 Все подключения закрыты');
};
