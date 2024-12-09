//logica de conexion con la DB

// import mongoose from "mongoose";

// const MONGO_URL = "mongodb://localhost:27017/CLONE-WHATSAPP";

// //.connect se utiliza para establecer una conexion con la DB
// //Recibe un connection_string (url de la DB) y un objeto de configuracion
// mongoose.connect(MONGO_URL, {})
//   .then(() => {
//     console.log("Se establecio la conexion con mongoDB");
//   })
//   .catch((error) => {
//     console.error("La conexion con mongoDB ha fallado", error);
//   })
//   .finally(() => {
//     console.log("El proceso de conexion con la DB esta finalizado");
//   });

// export default mongoose;

import mongoose from 'mongoose';
import ENVIROMENT from './enviroment.js';

const connectDB = async () => {
  try {
    await mongoose.connect(ENVIROMENT.MONGO_URL);

    console.log("✅ Conexión exitosa a MongoDB");

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

