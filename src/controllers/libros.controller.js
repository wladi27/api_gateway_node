import { db, parseLibroRow } from '../db/database.js';

// GET /api/libros (permite filtros opcionales: ?disponible=true, ?autor=García, ?q=soledad)
export const obtenerLibros = (req, res, next) => {
  try {
    const { disponible, autor, q } = req.query;

    let sql = 'SELECT * FROM libros WHERE 1=1';
    const params = [];

    if (disponible !== undefined) {
      const isDisp = disponible === 'true' || disponible === '1';
      sql += ' AND disponible = ?';
      params.push(isDisp ? 1 : 0);
    }

    if (autor) {
      sql += ' AND autor LIKE ?';
      params.push(`%${autor}%`);
    }

    if (q) {
      sql += ' AND (titulo LIKE ? OR autor LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY id ASC';

    const rows = db.prepare(sql).all(...params);
    const libros = rows.map(parseLibroRow);

    res.json(libros);
  } catch (error) {
    next(error);
  }
};

// GET /api/libros/:id
export const obtenerLibroPorId = (req, res, next) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    if (!row) {
      return res.status(404).json({ error: `No existe libro con ID: ${id}` });
    }

    res.json(parseLibroRow(row));
  } catch (error) {
    next(error);
  }
};

// POST /api/libros
export const crearLibro = (req, res, next) => {
  try {
    const { titulo, autor, anio, disponible, etiquetas } = req.body;

    const dispVal = disponible !== undefined ? (Boolean(disponible) ? 1 : 0) : 1;
    const etiqVal = JSON.stringify(Array.isArray(etiquetas) ? etiquetas : []);

    const insert = db.prepare(`
      INSERT INTO libros (titulo, autor, anio, disponible, etiquetas)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(titulo.trim(), autor.trim(), Number(anio), dispVal, etiqVal);
    const nuevoLibro = db.prepare('SELECT * FROM libros WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      mensaje: 'Libro creado exitosamente en SQLite',
      libro: parseLibroRow(nuevoLibro)
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/libros/:id (Reemplazo completo)
export const actualizarLibroCompleto = (req, res, next) => {
  try {
    const { id } = req.params;
    const libroExistente = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    if (!libroExistente) {
      return res.status(404).json({ error: `No existe libro con ID: ${id}` });
    }

    const { titulo, autor, anio, disponible, etiquetas } = req.body;
    const dispVal = disponible !== undefined ? (Boolean(disponible) ? 1 : 0) : 1;
    const etiqVal = JSON.stringify(Array.isArray(etiquetas) ? etiquetas : []);

    db.prepare(`
      UPDATE libros
      SET titulo = ?, autor = ?, anio = ?, disponible = ?, etiquetas = ?
      WHERE id = ?
    `).run(titulo.trim(), autor.trim(), Number(anio), dispVal, etiqVal, Number(id));

    const libroActualizado = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    res.json({
      mensaje: 'Libro reemplazado completamente',
      libro: parseLibroRow(libroActualizado)
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/libros/:id (Actualización parcial)
export const actualizarLibroParcial = (req, res, next) => {
  try {
    const { id } = req.params;
    const libroExistente = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    if (!libroExistente) {
      return res.status(404).json({ error: `No existe libro con ID: ${id}` });
    }

    const { titulo, autor, anio, disponible, etiquetas } = req.body;
    const campos = [];
    const params = [];

    if (titulo !== undefined) {
      campos.push('titulo = ?');
      params.push(titulo.trim());
    }
    if (autor !== undefined) {
      campos.push('autor = ?');
      params.push(autor.trim());
    }
    if (anio !== undefined) {
      campos.push('anio = ?');
      params.push(Number(anio));
    }
    if (disponible !== undefined) {
      campos.push('disponible = ?');
      params.push(Boolean(disponible) ? 1 : 0);
    }
    if (etiquetas !== undefined) {
      campos.push('etiquetas = ?');
      params.push(JSON.stringify(Array.isArray(etiquetas) ? etiquetas : []));
    }

    if (campos.length > 0) {
      params.push(Number(id));
      const sql = `UPDATE libros SET ${campos.join(', ')} WHERE id = ?`;
      db.prepare(sql).run(...params);
    }

    const libroActualizado = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    res.json({
      mensaje: 'Libro actualizado parcialmente',
      libro: parseLibroRow(libroActualizado)
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/libros/:id
export const eliminarLibro = (req, res, next) => {
  try {
    const { id } = req.params;
    const libroExistente = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(id));

    if (!libroExistente) {
      return res.status(404).json({ error: `No existe libro con ID: ${id}` });
    }

    db.prepare('DELETE FROM libros WHERE id = ?').run(Number(id));

    res.json({
      mensaje: 'Libro eliminado de la base de datos',
      libro: parseLibroRow(libroExistente)
    });
  } catch (error) {
    next(error);
  }
};
