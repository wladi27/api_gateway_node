// Middleware centralizado de manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error('[GATEWAY ERROR]:', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error: message,
    codigo: err.code || 'INTERNAL_ERROR',
    ruta: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};
