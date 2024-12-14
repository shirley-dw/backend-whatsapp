import mongoose from 'mongoose';
import ENVIROMENT from '../config/enviroment.js';

const MONGO_URL = ENVIROMENT.MONGO_DB_CONNECTION_STR
  ? `${ENVIROMENT.MONGO_DB_CONNECTION_STR}${ENVIROMENT.MONGO_DB_DATABASE}`
  : ENVIROMENT.MONGO_URL; // Usa local solo si no hay conexión en la nube

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`✅ Conexión exitosa a MongoDB en: ${MONGO_URL}`);

    // Manejar eventos de la conexión   
    mongoose.connection.on("connected", () => {
      console.log("📡 MongoDB está conectado");
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB se ha desconectado");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Error en MongoDB:", err);
    });
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1); // Finaliza el proceso si no se puede conectar
  }
};

export default connectDB;


