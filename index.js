const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

// Creación del servidor
const app = express();

// Conectar a la BD
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// Puerto de la app
const puerto = process.env.puerto || 4000;

// Importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

// Arrancar la app
app.listen(puerto, "0.0.0.0", () => {
  console.log(`El servidor está funcionando en el puerto ${puerto}`);
});
