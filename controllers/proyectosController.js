const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
const exceptionsHandler = require("../exceptions/exceptionsHandler");

// Creación de un nuevo proyecto
exports.crearProyecto = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    // Crear nuevo proyecto
    const proyecto = new Proyecto(req.body);
    // Guardar el creador mediante el JWT
    proyecto.creador = req.usuario.id;
    // Guardar proyecto
    await proyecto.save();
    // Mensaje de confirmación
    res.json({ proyecto });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};

// Obtención de los proyectos por usuario
exports.obtenerProyectos = async (req, res) => {
  try {
    // Obtener proyectos desde la BD
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: "desc",
    });
    // Retornar el objeto proyectos
    res.json({ proyectos });
  } catch (error) {
    res.status(500).send("Ocurrió un error inesperado");
    console.log(error);
  }
};

// Actualización del proyecto
exports.actualizarProyecto = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  // Extraer info del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = { nombre: nombre };
  try {
    // Validar ID
    let proyecto = await Proyecto.findById(req.params.id);
    // Existencia del proyecto
    if (!proyecto)
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Actualizar proyecto en BD
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    // Mensaje de confirmación
    res.json({ proyecto });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};

// Eliminación del proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    // Validar ID
    let proyecto = await Proyecto.findById(req.params.id);
    // Existencia del proyecto
    if (!proyecto)
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    // Verificar creador
    if (proyecto.creador.toString() !== req.usuario.id)
      return res.status(401).json({ msg: "No autorizado" });
    // Eliminar de la BD
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    try {
      res.status(400).json({ msg: exceptionsHandler.handleException(error) });
    } catch (error) {
      res.status(500).send("Ocurrió un error inesperado");
      console.log(error);
    }
  }
};
