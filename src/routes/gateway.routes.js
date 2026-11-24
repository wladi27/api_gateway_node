import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET /api/gateway/health - Estado de salud del Gateway y servicios
router.get('/health', (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const test = db.prepare('SELECT 1 as alive').get();
    if (test.alive === 1) dbStatus = 'healthy';
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }

  res.json({
    gateway: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      sqlite_database: dbStatus,
      libros_service: 'active',
      prestamos_service: 'active'
    }
  });
});

// GET /api/gateway/routes - Catálogo de rutas expuestas
router.get('/routes', (req, res) => {
  res.json({
    descripcion: 'Rutas disponibles en el API Gateway de la Biblioteca',
    endpoints: [
      { metodo: 'GET', ruta: '/api/libros', descripcion: 'Listar todos los libros (filtros: ?disponible=true, ?autor=..., ?q=...)' },
      { metodo: 'GET', ruta: '/api/libros/:id', descripcion: 'Obtener un libro por ID' },
      { metodo: 'POST', ruta: '/api/libros', descripcion: 'Registrar un nuevo libro' },
      { metodo: 'PUT', ruta: '/api/libros/:id', descripcion: 'Reemplazar un libro completo' },
      { metodo: 'PATCH', ruta: '/api/libros/:id', descripcion: 'Actualizar campos específicos de un libro' },
      { metodo: 'DELETE', ruta: '/api/libros/:id', descripcion: 'Eliminar un libro' },
      { metodo: 'GET', ruta: '/api/prestamos', descripcion: 'Listar préstamos (filtro opcional: ?estado=activo)' },
      { metodo: 'POST', ruta: '/api/prestamos', descripcion: 'Prestar un libro a un usuario' },
      { metodo: 'PUT', ruta: '/api/prestamos/:id/devolver', descripcion: 'Devolver un libro a la biblioteca' },
      { metodo: 'GET', ruta: '/api/gateway/health', descripcion: 'Comprobar salud del Gateway y la base de datos' }
    ]
  });
});

export default router;
