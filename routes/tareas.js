const express = require("express");
const router = express.Router();
const tareasController = require("../controllers/tareasController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// api/tareas
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre de la tarea es obligatorio").notEmpty(),
    check("proyecto", "El id del proyecto es obligatorio").notEmpty(),
  ],
  tareasController.crearTarea
);
router.get(
  "/",
  auth,
  [check("proyecto", "El id del proyecto es obligatorio").notEmpty()],
  tareasController.obtenerTareas
);
router.put("/:id", auth, tareasController.actualizarTarea);
router.delete("/:id", auth, tareasController.eliminarTarea);

module.exports = router;
