export const validarPrestamo = (req, res, next) => {
  const { libro_id, usuario } = req.body;

  if (!libro_id || isNaN(Number(libro_id))) {
    return res.status(400).json({
      error: 'El campo "libro_id" es obligatorio y debe ser un número de ID válido.'
    });
  }

  if (!usuario || typeof usuario !== 'string' || usuario.trim() === '') {
    return res.status(400).json({
      error: 'El campo "usuario" es obligatorio con el nombre de quien solicita el préstamo.'
    });
  }

  next();
};
