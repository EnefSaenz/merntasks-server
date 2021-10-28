const express = require("express");
const router = express.Router();
const proyectosController = require("../controllers/proyectosController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// api/proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").notEmpty()],
  proyectosController.crearProyecto
);
router.get("/", auth, proyectosController.obtenerProyectos);
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").notEmpty()],
  proyectosController.actualizarProyecto
);
router.delete("/:id", auth, proyectosController.eliminarProyecto);

module.exports = router;
