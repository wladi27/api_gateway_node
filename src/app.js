import express from 'express';
import librosRoutes from './routes/libros.routes.js';
import prestamosRoutes from './routes/prestamos.routes.js';
import gatewayRoutes from './routes/gateway.routes.js';
import { gatewayLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de parsing JSON
app.use(express.json());

// Logger global de peticiones (Monitoreo de tráfico del Gateway)
app.use(gatewayLogger);

// Ruta principal / informativa del API Gateway
app.get('/', (req, res) => {
  res.json({
    nombre: 'API Gateway - Biblioteca con SQLite',
    version: '1.0.0',
    estado: 'operativo',
    servicios: {
      libros: '/api/libros',
      prestamos: '/api/prestamos',
      gateway_status: '/api/gateway/health',
      rutas_disponibles: '/api/gateway/routes'
    }
  });
});

// Enrutamiento del Gateway hacia los módulos de la biblioteca
app.use('/api/libros', librosRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/gateway', gatewayRoutes);

// Manejo de rutas inexistentes (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    codigo: 'NOT_FOUND',
    sugerencia: 'Consulta /api/gateway/routes para ver los endpoints disponibles.'
  });
});

// Middleware centralizado de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 API Gateway de Biblioteca corriendo`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 Libros: http://localhost:${PORT}/api/libros`);
  console.log(`📑 Préstamos: http://localhost:${PORT}/api/prestamos`);
  console.log(`❤️  Salud: http://localhost:${PORT}/api/gateway/health`);
  console.log(`===============================================`);
});

export default app;