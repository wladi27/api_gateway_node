import { Router } from 'express';
import {
  obtenerPrestamos,
  crearPrestamo,
  devolverPrestamo
} from '../controllers/prestamos.controller.js';
import { validarPrestamo } from '../middlewares/validarPrestamo.js';

const router = Router();

// Rutas RESTful para /api/prestamos
router.get('/', obtenerPrestamos);
router.post('/', validarPrestamo, crearPrestamo);
router.put('/:id/devolver', devolverPrestamo);

export default router;
