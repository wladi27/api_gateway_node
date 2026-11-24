export const validarLibroCompleto = (req, res, next) => {
  const { titulo, autor, anio } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({
      error: 'El campo "titulo" es obligatorio y debe ser una cadena de texto válida.'
    });
  }

  if (!autor || typeof autor !== 'string' || autor.trim() === '') {
    return res.status(400).json({
      error: 'El campo "autor" es obligatorio y debe ser una cadena de texto válida.'
    });
  }

  if (anio === undefined || isNaN(Number(anio)) || Number(anio) <= 0) {
    return res.status(400).json({
      error: 'El campo "anio" es obligatorio y debe ser un número positivo válido.'
    });
  }

  next();
};

export const validarLibroParcial = (req, res, next) => {
  const { titulo, autor, anio, disponible, etiquetas } = req.body;

  if (
    titulo === undefined &&
    autor === undefined &&
    anio === undefined &&
    disponible === undefined &&
    etiquetas === undefined
  ) {
    return res.status(400).json({
      error: 'Debes enviar al menos un campo para actualizar (titulo, autor, anio, disponible, etiquetas).'
    });
  }

  if (titulo !== undefined && (typeof titulo !== 'string' || titulo.trim() === '')) {
    return res.status(400).json({ error: 'El campo "titulo" debe ser una cadena de texto válida.' });
  }

  if (autor !== undefined && (typeof autor !== 'string' || autor.trim() === '')) {
    return res.status(400).json({ error: 'El campo "autor" debe ser una cadena de texto válida.' });
  }

  if (anio !== undefined && (isNaN(Number(anio)) || Number(anio) <= 0)) {
    return res.status(400).json({ error: 'El campo "anio" debe ser un número positivo.' });
  }

  if (etiquetas !== undefined && !Array.isArray(etiquetas)) {
    return res.status(400).json({ error: 'El campo "etiquetas" debe ser un arreglo de cadenas.' });
  }

  next();
};