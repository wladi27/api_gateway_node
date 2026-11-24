import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que el directorio de la base de datos exista
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'biblioteca.db');
export const db = new DatabaseSync(dbPath);

// Activar claves foráneas
db.exec('PRAGMA foreign_keys = ON;');

// Inicializar esquema de tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    anio INTEGER NOT NULL,
    disponible INTEGER DEFAULT 1,
    etiquetas TEXT DEFAULT '[]',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    libro_id INTEGER NOT NULL,
    usuario TEXT NOT NULL,
    fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATETIME,
    estado TEXT DEFAULT 'activo',
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
  );
`);

// Precargar datos iniciales si la tabla de libros está vacía
const conteoLibros = db.prepare('SELECT COUNT(*) as total FROM libros').get();

if (conteoLibros.total === 0) {
  const insertLibro = db.prepare(`
    INSERT INTO libros (titulo, autor, anio, disponible, etiquetas)
    VALUES (?, ?, ?, ?, ?)
  `);

  const datosIniciales = [
    {
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      anio: 1967,
      disponible: 1,
      etiquetas: JSON.stringify(['realismo mágico', 'clásico', 'novela'])
    },
    {
      titulo: 'El Aleph',
      autor: 'Jorge Luis Borges',
      anio: 1949,
      disponible: 1,
      etiquetas: JSON.stringify(['cuentos', 'ficción', 'filosofía'])
    },
    {
      titulo: 'Rayuela',
      autor: 'Julio Cortázar',
      anio: 1963,
      disponible: 1,
      etiquetas: JSON.stringify(['boom latinoamericano', 'novela'])
    },
    {
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      anio: 1605,
      disponible: 1,
      etiquetas: JSON.stringify(['clásico', 'aventura'])
    }
  ];

  for (const libro of datosIniciales) {
    insertLibro.run(libro.titulo, libro.autor, libro.anio, libro.disponible, libro.etiquetas);
  }
}

// Función auxiliar para parsear filas de SQLite a objetos JSON amigables
export const parseLibroRow = (row) => {
  if (!row) return null;
  let etiquetas = [];
  try {
    etiquetas = typeof row.etiquetas === 'string' ? JSON.parse(row.etiquetas) : (row.etiquetas || []);
  } catch {
    etiquetas = [];
  }

  return {
    ...row,
    disponible: Boolean(row.disponible),
    etiquetas
  };
};
