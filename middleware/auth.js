const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Leer token desde el header
  const token = req.header("x-auth-token");
  // Verificar existencia de token
  if (!token)
    return res
      .status(401)
      .json({ msg: "No hay token, no tienes los permisos necesarios." });
  // Validar el token
  try {
    const cifrado = jwt.verify(token, process.env.SECRET_WORD);
    req.usuario = cifrado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token inválido." });
  }
};
