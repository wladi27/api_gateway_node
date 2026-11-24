import { db, parseLibroRow } from '../db/database.js';

// GET /api/prestamos
export const obtenerPrestamos = (req, res, next) => {
  try {
    const { estado } = req.query;
    let sql = `
      SELECT p.*, l.titulo AS libro_titulo, l.autor AS libro_autor
      FROM prestamos p
      INNER JOIN libros l ON p.libro_id = l.id
    `;
    const params = [];

    if (estado) {
      sql += ' WHERE p.estado = ?';
      params.push(estado);
    }

    sql += ' ORDER BY p.fecha_prestamo DESC';

    const prestamos = db.prepare(sql).all(...params);
    res.json(prestamos);
  } catch (error) {
    next(error);
  }
};

// POST /api/prestamos (Registra un préstamo y marca el libro como no disponible)
export const crearPrestamo = (req, res, next) => {
  try {
    const { libro_id, usuario } = req.body;
    const libro = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(libro_id));

    if (!libro) {
      return res.status(404).json({ error: `El libro con ID ${libro_id} no existe.` });
    }

    if (libro.disponible === 0) {
      return res.status(409).json({
        error: `El libro "${libro.titulo}" ya se encuentra prestado actualmente.`
      });
    }

    // Registrar préstamo
    const insertPrestamo = db.prepare(`
      INSERT INTO prestamos (libro_id, usuario, estado)
      VALUES (?, ?, 'activo')
    `);
    const resultado = insertPrestamo.run(Number(libro_id), usuario.trim());

    // Actualizar disponibilidad del libro a 0
    db.prepare('UPDATE libros SET disponible = 0 WHERE id = ?').run(Number(libro_id));

    const nuevoPrestamo = db.prepare(`
      SELECT p.*, l.titulo AS libro_titulo, l.autor AS libro_autor
      FROM prestamos p
      INNER JOIN libros l ON p.libro_id = l.id
      WHERE p.id = ?
    `).get(resultado.lastInsertRowid);

    res.status(201).json({
      mensaje: 'Préstamo registrado exitosamente',
      prestamo: nuevoPrestamo
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/prestamos/:id/devolver (Devuelve el libro y restablece disponibilidad)
export const devolverPrestamo = (req, res, next) => {
  try {
    const { id } = req.params;
    const prestamo = db.prepare('SELECT * FROM prestamos WHERE id = ?').get(Number(id));

    if (!prestamo) {
      return res.status(404).json({ error: `Préstamo con ID ${id} no encontrado.` });
    }

    if (prestamo.estado === 'devuelto') {
      return res.status(400).json({ error: 'Este préstamo ya fue devuelto con anterioridad.' });
    }

    // Marcar préstamo como devuelto
    db.prepare(`
      UPDATE prestamos
      SET estado = 'devuelto', fecha_devolucion = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(Number(id));

    // Marcar libro nuevamente como disponible (1)
    db.prepare('UPDATE libros SET disponible = 1 WHERE id = ?').run(prestamo.libro_id);

    const prestamoActualizado = db.prepare(`
      SELECT p.*, l.titulo AS libro_titulo, l.autor AS libro_autor
      FROM prestamos p
      INNER JOIN libros l ON p.libro_id = l.id
      WHERE p.id = ?
    `).get(Number(id));

    res.json({
      mensaje: 'Libro devuelto con éxito a la biblioteca',
      prestamo: prestamoActualizado
    });
  } catch (error) {
    next(error);
  }
};
