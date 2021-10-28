// Rutas para autenticación
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

// Login
// api/auth
router.post(
  "/",
  [
    check("email", "Agrega un email válido").isEmail(),
    check(
      "password",
      "El password debe contener al menos 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  authController.authenticateUser
);

// Obtener usuario autenticado
router.get("/", auth, authController.userAuthenticated);

module.exports = router;
