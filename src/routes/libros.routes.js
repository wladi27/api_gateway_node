import { Router } from 'express';
import {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibroCompleto,
  actualizarLibroParcial,
  eliminarLibro
} from '../controllers/libros.controller.js';
import {
  validarLibroCompleto,
  validarLibroParcial
} from '../middlewares/validarLibro.js';

const router = Router();

// Rutas RESTful para /api/libros
router.get('/', obtenerLibros);
router.get('/:id', obtenerLibroPorId);
router.post('/', validarLibroCompleto, crearLibro);
router.put('/:id', validarLibroCompleto, actualizarLibroCompleto);
router.patch('/:id', validarLibroParcial, actualizarLibroParcial);
router.delete('/:id', eliminarLibro);

export default router;
