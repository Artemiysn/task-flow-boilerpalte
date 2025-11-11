import amqp from "amqplib";
import { config } from "../config/services_configs";

let rabbitConnection: amqp.ChannelModel | null = null;

export const connectToRabbitMQ = async (): Promise<amqp.ChannelModel> => {

  if (rabbitConnection) return rabbitConnection;

  rabbitConnection = await amqp.connect(config.rabbitmq);

  rabbitConnection.on("error", (err) => {
    console.error("❌ RabbitMQ connection error:", err);
  });

  rabbitConnection.on("close", () => {
    console.log("🔌 RabbitMQ соединение закрыто");
    rabbitConnection = null;
  });

  console.log("✅ Подключение к RabbitMQ установлено");
  return rabbitConnection;
};

export const getRabbitMQConnection = (): amqp.ChannelModel => {
  if (!rabbitConnection) {
    throw new Error("RabbitMQ not initialized. Call connectToRabbitMQ first.");
  }
  return rabbitConnection;
};

export const disconnectRabbitMQ = async () => {
  if (rabbitConnection) {
    await rabbitConnection.close();
  }
};
