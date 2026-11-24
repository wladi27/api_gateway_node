# API Gateway - Biblioteca con Express y SQLite

API Gateway y servicio para la gestión de una biblioteca desarrollado en **Node.js**, **Express** y **SQLite** (usando el módulo nativo `node:sqlite`).

---

## 🚀 Cómo ejecutar

Desde la terminal, ubícate en la carpeta `api_gateway`:

```bash
cd api_gateway
npm run dev
```

El servidor iniciará en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```text
api_gateway/
├── data/
│   └── biblioteca.db            # Base de datos persistente SQLite
├── src/
│   ├── controllers/
│   │   ├── libros.controller.js     # Lógica CRUD de libros con SQL
│   │   └── prestamos.controller.js  # Lógica de préstamos y devoluciones
│   ├── db/
│   │   └── database.js              # Conexión, tablas y precarga en SQLite
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js # Manejo de errores centralizado
│   │   ├── logger.middleware.js       # Logger de tráfico tipo Gateway
│   │   ├── validarLibro.js            # Validaciones para libros
│   │   └── validarPrestamo.js         # Validaciones para préstamos
│   ├── routes/
│   │   ├── gateway.routes.js        # Health check y catálogo de rutas
│   │   ├── libros.routes.js         # Rutas de /api/libros
│   │   └── prestamos.routes.js      # Rutas de /api/prestamos
│   └── app.js                       # Servidor Express y Gateway
└── package.json
```

---

## 📡 Endpoints del API Gateway

### 1. Información y Diagnóstico
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Información del Gateway y estado |
| `GET` | `/api/gateway/health` | Estado del gateway y conexión a SQLite |
| `GET` | `/api/gateway/routes` | Catálogo de rutas disponibles |

---

### 2. Módulo de Libros (`/api/libros`)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/libros` | Listar todos los libros. Permite filtros: `?disponible=true`, `?autor=García`, `?q=soledad` |
| `GET` | `/api/libros/:id` | Obtener un libro por su ID |
| `POST` | `/api/libros` | Crear un nuevo libro |
| `PUT` | `/api/libros/:id` | Reemplazo completo del libro |
| `PATCH` | `/api/libros/:id` | Actualización parcial de campos |
| `DELETE` | `/api/libros/:id` | Eliminar un libro |

#### Ejemplo Body POST `/api/libros`:
```json
{
  "titulo": "Rayuela",
  "autor": "Julio Cortázar",
  "anio": 1963,
  "disponible": true,
  "etiquetas": ["novela", "boom latinoamericano"]
}
```

---

### 3. Módulo de Préstamos (`/api/prestamos`)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/prestamos` | Listar préstamos (filtro opcional `?estado=activo`) |
| `POST` | `/api/prestamos` | Registrar préstamo (marca automáticamente el libro como no disponible) |
| `PUT` | `/api/prestamos/:id/devolver` | Devolver libro (restablece disponibilidad del libro a `true`) |

#### Ejemplo Body POST `/api/prestamos`:
```json
{
  "libro_id": 1,
  "usuario": "María Pérez"
}
```
