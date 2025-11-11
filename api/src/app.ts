import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { config } from "./config/services_configs";
import { initializeConnections } from "./connections/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Инициализация подключений при запуске
initializeConnections();

app.get("/health", (req, res) => {
  res.json({ status: "OK 1", service: "API" });
});

app.get("/test", (req, res) => {
  res.json({ status: "OK", service: "API" });
});

app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
});
