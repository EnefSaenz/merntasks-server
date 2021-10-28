const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const exceptionsHandler = require("../exceptions/exceptionsHandler");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  // Extraer el password
  const { password } = req.body;
  try {
    let usuario;
    // Crear nuevo usuario
    usuario = new Usuario(req.body);
    // Hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    // Guardar usuario
    await usuario.save();
    // Crear y firmar el JWT
    const payload = { usuario: { id: usuario.id } };
    jwt.sign(
      payload,
      process.env.SECRET_WORD,
      { expiresIn: 3600 },
      (error, token) => {
        if (error) throw error;
        // Mensaje de confirmación
        res.json({ token: token });
      }
    );
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};
