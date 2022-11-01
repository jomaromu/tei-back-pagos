import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import Server from "./class/server";

// rutas
import pagoRoute from "./routes/pagoRoute";

// const server = new Server();
const server = Server.instance;

// body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// file upload
server.app.use(fileUpload());

// cors
server.app.use(cors({ origin: true, credentials: true }));

// Models
require("./models/pedidoModel");
require("./models/workerModel");
require("./models/metodoPagoModel");
require("./models/modalidadPagoModel");

// conexion local
mongoose.connect(
  "mongodb://127.0.0.1:27017/angie",
  { autoIndex: false },
  (err) => {
    if (err) throw err;
    console.log("Base de datos Online");
  }
);

// usar las rutas
server.app.use("/pago", pagoRoute);

// correr servidor
server.start(() => {
  console.log(`Servidor corriendo en el puerto: ${server.port}`);
});
