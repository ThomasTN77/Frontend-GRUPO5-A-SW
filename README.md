# Frontend Grupo 5 - Examen 4

Frontend desarrollado en **Angular** que consume la API REST de animales (FastAPI + PostgreSQL en Neon), cumpliendo con todas las especificaciones de operaciones CRUD y navegación mediante sidebar.

---

## 1. URL del Backend

La aplicación consume la API ubicada en:

- **URL Base de la API:** `http://127.0.0.1:8000`
- **Recurso principal:** `http://127.0.0.1:8000/animales`
- **Documentación Swagger / OpenAPI:** `http://127.0.0.1:8000/docs`

> La URL base se encuentra centralizada en el archivo de configuración `src/environments/environment.ts`.

---

## 2. Requisitos Previos

- **Node.js:** Versión 18 o superior (recomendado v20+)
- **npm:** Versión 9 o superior
- **Angular CLI:** Versión 22 o superior (`npm install -g @angular/cli`)
- El backend (API de FastAPI en Python) debe estar corriendo en `http://127.0.0.1:8000` con CORS habilitado.

---

## 3. Instrucciones para Levantar el Frontend en Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ThomasTN77/Frontend-GRUPO5-A-SW.git
   cd Frontend-GRUPO5-A-SW
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   *(o alternativamente: `npm start`)*

4. **Abrir en el navegador:**
   Ingresa a: [http://localhost:4200](http://localhost:4200)

---

## 4. Funcionalidades y Operaciones Implementadas

La aplicación cuenta con un **Sidebar** persistente donde la opción activa se resalta y permite navegar entre las distintas entidades del grupo.

Para la entidad **Animales**, se implementaron las 5 operaciones HTTP requeridas comunicándose directamente con el backend:

| Operación | Método HTTP | Endpoint | Descripción |
| :--- | :---: | :--- | :--- |
| **Listar la colección** | `GET` | `/animales` | Obtiene y lista todos los registros en la tabla. |
| **Consultar uno por ID** | `GET` | `/animales/{id}` | Filtra por UUID. Si existe lo muestra, si no informa que no fue encontrado. |
| **Crear** | `POST` | `/animales` | Formulario popup para registrar un nuevo animal (nombre, especie, edad). Persiste en BD. |
| **Editar** | `PUT` | `/animales/{id}` | Edita los datos de un animal existente y actualiza la tabla. |
| **Eliminar** | `DELETE` | `/animales/{id}` | Elimina el registro de la base de datos tras confirmación del usuario. |

En caso de que el backend no esté encendido o no responda, el frontend muestra una notificación de error de conexión en lugar de presentar datos simulados.

---

## 5. Módulo Libros (Mauricio)

### Video de evidencia

Llamados a los endpoints vistos en el panel Network del navegador: PEGAR_AQUI_EL_LINK_DEL_VIDEO

### Backend

- **URL Base de la API:** `http://127.0.0.1:8001` (variable `librosApiUrl` en `src/environments/environment.ts`)
- **Recurso:** `http://127.0.0.1:8001/libros`
- **Swagger:** `http://127.0.0.1:8001/docs`
- Código en la carpeta `Mauricio` de [Ejemplos-API-grupo5](https://github.com/ThomasTN77/Ejemplos-API-grupo5). Se levanta con:

```bash
uvicorn main:app --reload --port 8001
```

Usa el puerto 8001 para poder correr al mismo tiempo que la API de animales (8000). Tiene CORS habilitado para `http://localhost:4200`.

### Operaciones

| Operación | Método HTTP | Endpoint | Descripción |
| :--- | :---: | :--- | :--- |
| **Listar la colección** | `GET` | `/libros` | Lista todos los libros en la tabla. |
| **Consultar uno por ID** | `GET` | `/libros/{id}` | Filtra por ID numérico. Si no existe muestra "Libro no encontrado". |
| **Crear** | `POST` | `/libros` | Popup para registrar título, autor, año y disponibilidad. |
| **Editar** | `PUT` | `/libros/{id}` | Edita un libro existente y recarga la tabla desde la API. |
| **Eliminar** | `DELETE` | `/libros/{id}` | Elimina el libro tras confirmación. |
