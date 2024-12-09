import cors from "cors";
import express from "express";
import authRouter from "../routes/auth.route.js";
import statusRouter from "../routes/status.route.js";
import connectDB from "./config/db.config.js";
import { customCorsMiddleware } from "./middlewares/cors.middleware.js";

const PORT = 3000;
const app = express();


app.use(customCorsMiddleware)

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/status", statusRouter);
app.use("/api/auth", authRouter);

const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(
        `✅ El servidor se está ejecutando en http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1); // Finaliza el proceso si hay un error crítico
  }
};

startServer();
