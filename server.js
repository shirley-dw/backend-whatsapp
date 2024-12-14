import cors from "cors";
import express from "express";
import authRouter from "./src/routes/auth.route.js";
import messageRouter from "./src/routes/messages.route.js";
import contactRouter from "./src/routes/contact.route.js";
import statusRouter from "./src/routes/status.route.js";
import connectDB from './src/config/db.config.js';
import { customCorsMiddleware } from "./src/middlewares/cors.middleware.js";
import ENVIROMENT from "./src/config/enviroment.js";

const PORT = ENVIROMENT.PORT;
const app = express();

// Middleware para procesar datos codificados en URL (opcional)
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Configurar CORS
app.use(customCorsMiddleware);

// Middleware para procesar solicitudes JSON (opcional)
app.use(express.json());


// Rutas
app.use("/api/status", statusRouter);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/contacts", contactRouter);


const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`✅ Servidor y MongoDB en la nube están listos en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1); // Finaliza el proceso si hay un error crítico
  }
};

export default startServer;
