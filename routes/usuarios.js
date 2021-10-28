// Rutas para crear usuarios
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { check } = require("express-validator");

// Crear usuario
// api/usuarios
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check(
      "password",
      "El password debe contener al menos 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  usuariosController.crearUsuario
);

module.exports = router;
