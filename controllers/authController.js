const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const exceptionsHandler = require("../exceptions/exceptionsHandler");
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  // Extraer el email y password
  const { email, password } = req.body;

  try {
    // Verificar existencia de usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "El usuario no existe!" });
    // Verificar password
    const isValidPass = await bcryptjs.compare(password, usuario.password);
    if (!isValidPass)
      return res.status(400).json({ msg: "La contraseña es incorrecta!" });
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

exports.userAuthenticated = async (req, res) => {
  try {
    const user = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).send("Ocurrió un error inesperado");
    console.log(error);
  }
};
