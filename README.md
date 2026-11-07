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

Llamados a los endpoints vistos en el panel Network del navegador: https://youtu.be/EM0t8e9c9_I

### Backend

- **URL Base de la API:** `http://127.0.0.1:8001` (variable `librosApiUrl` en `src/environments/environment.ts`)
- **Recurso:** `http://127.0.0.1:8001/libros`
- **Documentación Swagger:** `http://127.0.0.1:8001/docs`
- Usa el puerto **8001** para poder correr al mismo tiempo que la API de animales (8000).
- Tiene CORS habilitado para `http://localhost:4200`.

### Cómo levantar el backend de libros

El código está en la carpeta `Mauricio` del repositorio [Ejemplos-API-grupo5](https://github.com/ThomasTN77/Ejemplos-API-grupo5).

1. **Clonar y entrar a la carpeta:**
   ```bash
   git clone https://github.com/ThomasTN77/Ejemplos-API-grupo5.git
   cd Ejemplos-API-grupo5/Mauricio
   ```

2. **Crear el entorno virtual e instalar dependencias:**
   ```bash
   python -m venv .venv
   .venv\Scripts\python -m pip install -r requirements.txt
   ```

3. **Configurar la base de datos:** crear un archivo `.env` en la carpeta `Mauricio` (ver `.env.example`) con la cadena de conexión de PostgreSQL (Neon):
   ```
   DATABASE_URL=postgresql://usuario:contrasena@host/neondb?sslmode=require
   ```

4. **Correr la API en el puerto 8001:**
   ```bash
   .venv\Scripts\python -m uvicorn main:app --reload --port 8001
   ```
   Debe aparecer `Uvicorn running on http://127.0.0.1:8001`.

5. **Levantar el frontend** (sección 3) y entrar a **Libros** en el sidebar.

### Operaciones

| Operación | Método HTTP | Endpoint | Descripción |
| :--- | :---: | :--- | :--- |
| **Listar la colección** | `GET` | `/libros` | Lista todos los libros en la tabla. |
| **Consultar uno por ID** | `GET` | `/libros/{id}` | Filtra por ID numérico. Si no existe muestra "Libro no encontrado". |
| **Crear** | `POST` | `/libros` | Popup para registrar título, autor, año y disponibilidad. |
| **Editar** | `PUT` | `/libros/{id}` | Edita un libro existente y recarga la tabla desde la API. |
| **Eliminar** | `DELETE` | `/libros/{id}` | Elimina el libro tras confirmación. |

Si la API de libros no está encendida, la pantalla muestra "No se pudo conectar con la API de libros" en lugar de datos simulados.
