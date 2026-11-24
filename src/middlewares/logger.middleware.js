// Middleware de registro de peticiones tipo Gateway
export const gatewayLogger = (req, res, next) => {
  const inicio = Date.now();
  const { method, originalUrl, ip } = req;

  // Interceptar la finalización de la respuesta para medir tiempo y estado
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    
    console.log(
      `[${timestamp}] [GATEWAY] ${method} ${originalUrl} -> ${statusCode} (${duracion}ms) - IP: ${ip}`
    );
  });

  next();
};
