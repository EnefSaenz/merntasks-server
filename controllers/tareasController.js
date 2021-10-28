const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
const exceptionsHandler = require("../exceptions/exceptionsHandler");

// Creación de una nueva tarea
exports.crearTarea = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  // Extraer el proyecto desde el body
  const idProyecto = req.body.proyecto;
  try {
    // Verificar existencia del proyecto
    const proyecto = await Proyecto.findById(idProyecto);
    if (!proyecto)
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Crear nueva tarea
    const tarea = new Tarea(req.body);
    // Guardar tarea en BD
    await tarea.save();
    // Mensaje de confirmación
    res.json({ tarea });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};

// Obtención de las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  // Extraer el proyecto desde el body
  const idProyecto = req.query.proyecto;
  try {
    // Verificar existencia del proyecto
    const proyecto = await Proyecto.findById(idProyecto);
    if (!proyecto)
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Obtener tareas desde la BD
    const tareas = await Tarea.find({ proyecto: idProyecto }).sort({
      creado: "desc",
    });
    // Retornar el objeto tareas
    res.json({ tareas });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};

// Actualización de la tarea
exports.actualizarTarea = async (req, res) => {
  // Extraer info de la tarea
  const { nombre, estado } = req.body;
  try {
    // Validar ID
    let tarea = await Tarea.findById(req.params.id);
    // Existencia de la tarea
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
    // Verificar creador
    const proyecto = await Proyecto.findById(tarea.proyecto);
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Crear nuevaTarea
    const nuevaTarea = {};
    if (nombre) nuevaTarea.nombre = nombre;
    if (tarea.estado !== estado) nuevaTarea.estado = estado;
    // Actualizar tarea en BD
    tarea = await Tarea.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevaTarea },
      { new: true }
    );
    // Mensaje de confirmación
    res.json({ tarea });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};

// Eliminación del tarea
exports.eliminarTarea = async (req, res) => {
  try {
    // Validar ID
    let tarea = await Tarea.findById(req.params.id);
    // Existencia del tarea
    if (!tarea) return res.status(404).json({ msg: "Tarea no encontrada" });
    // Verificar creador
    const proyecto = await Proyecto.findById(tarea.proyecto);
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Eliminar de la BD
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};
