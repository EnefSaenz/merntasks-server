exports.handleException = (error) => {
  if (error.message.includes("duplicate key error"))
    return "El objeto ingresado ya existe";
  else if (error.name === "MongoServerError") return "Error de BD";
  else if (error.name === "CastError") return "El id ingresado es incorrecto";
  else throw error;
};
