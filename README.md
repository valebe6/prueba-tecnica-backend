# Backend - Portal de equipo

Backend de la aplicación de tablero de notas desarrollado con NestJS, TypeScript, PostgreSQL y TypeORM.

## Tecnologías

- Node.js 20+
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT
- Passport
- bcrypt

---

# Requisitos

Para ejecución manual:

- Node.js 20+
- npm
- PostgreSQL

Para ejecución mediante Docker:

- Docker
- Docker Compose

---

# Configuración

Crear un archivo `.env` dentro de `back/`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=vale
DB_PASSWORD=Pass123
DB_NAME=pruebatecnica

JWT_SECRET=prueba-tecnica-secret-key
JWT_EXPIRES_IN=1d
```

> Cuando el backend se ejecuta mediante Docker Compose, las variables de conexión a PostgreSQL se configuran desde `docker-compose.yml`.

---

# Instalación

Desde esta carpeta:

```bash
npm install
```

---

# Ejecución en desarrollo

```bash
npm run start:dev
```

La API estará disponible en:

```text
http://localhost:3000
```

---

# Compilación

```bash
npm run build
```

---

# Ejecución en producción

```bash
npm run start:prod
```

---

# Base de datos

La aplicación utiliza PostgreSQL.

Base de datos:

```text
pruebatecnica
```

Usuario:

```text
vale
```

Puerto local:

```text
5433
```

El proyecto utiliza TypeORM para la persistencia de usuarios y notas.

---

# Usuarios de demostración

Al iniciar el proyecto por primera vez se crean:

### Administrador

```text
Email: admin@test.com
Password: Admin123
```

### Usuario

```text
Email: user@test.com
Password: User123
```

---

# API principal

## Autenticación

```http
POST /auth/login
```

Permite iniciar sesión y obtener un JWT.

## Usuarios

```http
GET /users
POST /users
GET /users/:id
PATCH /users/:id
PATCH /users/:id/status
```

Estas operaciones requieren autenticación y permisos de administrador.

## Notas

```http
GET /notes
POST /notes
PATCH /notes/:id
DELETE /notes/:id
```

Las operaciones de notas requieren un usuario autenticado.

## Dashboard

```http
GET /dashboard
```

Devuelve las métricas calculadas a partir de las notas.

---

# Autenticación

Las rutas protegidas utilizan JWT.

El token debe enviarse mediante:

```http
Authorization: Bearer <token>
```

Los usuarios inactivos no pueden acceder al área autenticada.

---

# Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

El backend se ejecuta dentro de un contenedor y se conecta al servicio PostgreSQL mediante:

```text
DB_HOST=postgres
DB_PORT=5432
```

El puerto de la API expuesto en la máquina local es:

```text
3000
```
