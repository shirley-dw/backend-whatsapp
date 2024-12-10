import cors from "cors";
import express from "express";
import authRouter from "../routes/auth.route.js";
import statusRouter from "../routes/status.route.js";
import connectDB from "./config/db.config.js";
import { customCorsMiddleware } from "./middlewares/cors.middleware.js";

const app = express();

// Middleware
app.use(customCorsMiddleware);
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/status", statusRouter);
app.use("/api/auth", authRouter);

// Conectar a MongoDB
connectDB().catch((error) => {
  console.error("❌ Error al conectar a la base de datos:", error);
});

export default app; // Exporta el objeto `app`
