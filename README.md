# Backend IPS — API REST

[![CI](https://github.com/KER04/backend_node/actions/workflows/ci.yml/badge.svg)](https://github.com/KER04/backend_node/actions/workflows/ci.yml)

API REST para la gestión integral de una **Institución Prestadora de Salud (IPS)**, desarrollada con **Node.js**, **TypeScript**, **Express** y **Sequelize ORM**. Incluye autenticación JWT con refresh tokens y control de acceso basado en roles (RBAC) dinámico.

> Proyecto académico — Universidad de La Guajira, Ingeniería de Sistemas.

---

## Características destacadas

- **RBAC dinámico** — control de acceso por ruta y método HTTP, configurable desde la base de datos (con `path-to-regexp`), sin reiniciar el servidor.
- **Autenticación JWT** con refresh tokens y contraseñas hasheadas con bcrypt.
- **Seguridad de serie** — helmet (cabeceras), CORS con whitelist y rate-limiting en el login contra fuerza bruta.
- **Validación de entrada con Zod** — esquemas por endpoint que rechazan datos malformados antes de tocar la base de datos.
- **Paginación** en todos los listados (`?page` y `?limit`).
- **Soft-deletes** — los registros se marcan `INACTIVE` en vez de borrarse, conservando el historial.
- **Tests automatizados** con Jest (19 tests del RBAC y la validación, sin necesidad de base de datos).
- **Documentación interactiva** de la API con Swagger/OpenAPI en `/api/docs`.

---

## Tecnologías

| Categoría | Tecnología |
|---|---|
| Runtime | Node.js |
| Lenguaje | TypeScript 5 |
| Framework | Express 5 |
| ORM | Sequelize 6 |
| Base de datos | MySQL (también soporta PostgreSQL y Oracle) |
| Autenticación | JWT (access token 60 min) + Refresh Tokens |
| Autorización | RBAC dinámico con `path-to-regexp` |
| Seguridad | bcryptjs, helmet, CORS con whitelist, express-rate-limit |
| Validación | Zod (esquemas por endpoint) |
| Testing | Jest + ts-jest (19 tests, sin BD) |
| Documentación | Swagger / OpenAPI 3 (`/api/docs`) |
| Utilitarios | dotenv, morgan, faker.js (seed) |

---

## Estructura del proyecto

```
backend_node/
├── src/
│   ├── server.ts                    # Punto de entrada
│   ├── config/
│   │   ├── index.ts                 # Clase App: Express, middlewares, rutas, DB
│   │   ├── jwt.ts                   # Carga y valida JWT_SECRET (falla si no existe)
│   │   └── swagger.ts               # Especificación OpenAPI 3
│   ├── database/
│   │   └── db.ts                    # Instancia de Sequelize
│   ├── schemas/                     # Esquemas de validación con Zod
│   │   ├── auth.schema.ts
│   │   └── entities.schema.ts
│   ├── middleware/
│   │   ├── auth.ts                  # Validación JWT + autorización RBAC
│   │   ├── validate.ts             # Middleware genérico de validación (Zod)
│   │   ├── rateLimit.ts            # Rate limiting del login
│   │   ├── auth.test.ts            # Tests del RBAC
│   │   └── validate.test.ts        # Tests del middleware de validación
│   ├── models/
│   │   ├── index.ts                 # Relaciones entre modelos de dominio
│   │   ├── doctor.ts
│   │   ├── patient.ts
│   │   ├── appointment.ts
│   │   ├── specialty.ts
│   │   ├── diagnosis.ts
│   │   ├── medicine.ts
│   │   ├── prescription.ts
│   │   ├── prescriptiondetail.ts
│   │   ├── procedure.ts
│   │   ├── payment.ts
│   │   └── authorization/
│   │       ├── user.ts
│   │       ├── role.ts
│   │       ├── resource.ts
│   │       ├── RoleUser.ts
│   │       ├── ResourceRole.ts
│   │       ├── RefreshToken.ts
│   │       └── relation.ts          # Relaciones entre modelos de autorización
│   ├── controller/
│   │   ├── doctor.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── appointment.controller.ts
│   │   ├── specialty.controller.ts
│   │   ├── diagnosis.controller.ts
│   │   ├── medicine.controller.ts
│   │   ├── prescription.controller.ts
│   │   ├── prescriptionDetail.controller.ts
│   │   ├── procedure.controller.ts
│   │   ├── payment.controller.ts
│   │   └── Authorization/
│   │       ├── auth.controller.ts
│   │       ├── user.controller.ts
│   │       ├── role.controller.ts
│   │       ├── resource.controller.ts
│   │       ├── role_user.controller.ts
│   │       ├── resourceRole.controller.ts
│   │       └── refresh_token.controller.ts
│   ├── routes/
│   │   ├── index.ts                 # Registro central de rutas
│   │   ├── doctor.ts
│   │   ├── patient.ts
│   │   ├── appointment.ts
│   │   ├── specialty.ts
│   │   ├── diagnosis.ts
│   │   ├── medicine.ts
│   │   ├── prescription.ts
│   │   ├── prescriptionDetail.ts
│   │   ├── procedure.ts
│   │   ├── payment.ts
│   │   └── authorization/
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── role.ts
│   │       ├── resource.ts
│   │       ├── role_user.ts
│   │       ├── resourceRole.ts
│   │       └── refresh_token.ts
│   ├── faker/
│   │   └── populate_data.ts         # Script para generar datos de prueba
│   ├── scripts/
│   │   └── syncRoleUser.ts
│   └── http/                        # Archivos .http para REST Client de VS Code
│       ├── doctor.http
│       ├── patient.http
│       ├── appointment.http
│       └── authorization/
│           ├── auth.http
│           ├── user.http
│           └── ...
├── dist/                            # Salida compilada (generada por `npm run build`)
├── .env                             # Variables de entorno (no subir al repositorio)
├── .env.example                     # Plantilla de variables (sin valores sensibles)
├── jest.config.js                   # Configuración de Jest
├── package.json
├── tsconfig.json
├── tsconfig.spec.json               # Configuración de TypeScript para los tests
└── README.md
```

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/KER04/backend_node.git
cd backend_node
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia la plantilla `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

```env
# Servidor
PORT=3000

# Orígenes permitidos para CORS (separados por coma)
CORS_ORIGIN=http://localhost:4200

# Base de datos (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=ips_db
DB_TIMEZONE=America/Bogota

# JWT — OBLIGATORIO. El servidor no arranca sin esta variable.
# Genera un secreto seguro con: openssl rand -hex 48
JWT_SECRET=cambia_esto_por_un_secreto_seguro_de_al_menos_32_caracteres
```

> **Importante:** Nunca subas `.env` al repositorio (ya está en `.gitignore`). El servidor **falla al iniciar** si `JWT_SECRET` no está definido — es una protección intencional contra usar una clave insegura por defecto.

### 4. Crear la base de datos en MySQL

```sql
CREATE DATABASE ips_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sequelize sincronizará automáticamente las tablas al iniciar el servidor.

---

## Uso

### Modo desarrollo

```bash
npm run dev
```

Usa `nodemon` + `ts-node` para recargar automáticamente al guardar cambios.

### Compilar para producción

```bash
npm run build   # compila TypeScript a dist/
npm start       # ejecuta node dist/server.js
```

> En producción se recomienda un gestor de procesos como **PM2** para reinicio automático.

---

## Autenticación y autorización

El sistema implementa autenticación con **JWT** y autorización con **RBAC dinámico** (Role-Based Access Control).

### Flujo de autenticación

```
1. POST /api/login        → recibe email + password
2. Servidor devuelve      → { user, token (60 min), refreshToken (5 min) }
3. Rutas protegidas       → Header: Authorization: Bearer <token>
4. Token expirado         → GET /refresh-token con el refreshToken
```

### Cómo funciona el RBAC

El middleware `auth.ts` valida en cada petición protegida:

1. Que el JWT sea válido y firmado con `JWT_SECRET`
2. Que el usuario exista en BD y esté en estado `ACTIVE`
3. Que exista un `Resource` activo que coincida con la ruta y el método HTTP (usando `path-to-regexp`)
4. Que el usuario tenga un `Role` asignado que tenga acceso a ese `Resource`

Esto permite controlar permisos granulares por ruta y método, directamente desde la base de datos, sin reiniciar el servidor.

### Modelos de seguridad

| Modelo | Tabla | Descripción |
|---|---|---|
| `User` | `users` | Usuarios del sistema (email único, password hasheado con bcrypt) |
| `Role` | `roles` | Roles del sistema (ej: ADMIN, DOCTOR, RECEPCIONISTA) |
| `Resource` | `resources` | Rutas + método HTTP protegidas (ej: `GET /api/doctor/:id`) |
| `RoleUser` | `role_users` | Tabla pivot — asignación de roles a usuarios |
| `ResourceRole` | `resource_roles` | Tabla pivot — permisos de roles sobre recursos |
| `RefreshToken` | `refresh_tokens` | Tokens de refresco almacenados por usuario |

---

## Endpoints

### Autenticación (pública)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/register` | Registro de nuevo usuario (validado con Zod) |
| `POST` | `/api/login` | Inicio de sesión — devuelve token + refreshToken (rate-limited: 5 intentos / 15 min) |
| `GET` | `/refresh-token` | Renueva el access token usando el refreshToken |

### Utilidad

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Health check (estado del servidor, uptime) |
| `GET` | `/api/docs` | Documentación interactiva Swagger / OpenAPI |

### Patrón de rutas por módulo

Cada módulo de dominio expone dos grupos de rutas:

```
# Rutas públicas (sin autenticación)
GET    /api/<recurso>/public        → Listar (paginado: ?page=1&limit=20)
GET    /api/<recurso>/public/:id    → Obtener por ID

# Rutas protegidas (requieren JWT + RBAC)
GET    /api/<recurso>               → Listar (paginado: ?page=1&limit=20)
GET    /api/<recurso>/:id           → Obtener por ID
POST   /api/<recurso>               → Crear (validado con Zod)
PUT    /api/<recurso>/:id           → Actualizar (validado con Zod)
DELETE /api/<recurso>/:id           → Eliminar (soft delete → INACTIVE)
```

Los listados devuelven un objeto paginado:

```json
{ "data": [ ... ], "total": 50, "page": 1, "totalPages": 3 }
```

Los `POST` y `PUT` validan el cuerpo con Zod; ante datos inválidos responden `400` con los errores por campo:

```json
{ "errors": { "email": ["El email no es válido"] } }
```

### Módulos de dominio

| Módulo | Ruta base | Descripción |
|---|---|---|
| Médicos | `/api/doctor` | CRUD de médicos, vinculados a una especialidad |
| Pacientes | `/api/patient` | CRUD de pacientes |
| Citas médicas | `/api/appointment` | Gestión de citas (doctor + paciente + fecha) |
| Especialidades | `/api/specialty` | Catálogo de especialidades médicas |
| Diagnósticos | `/api/diagnosis` | Diagnósticos asociados a citas y pacientes |
| Medicamentos | `/api/medicine` | Catálogo de medicamentos con precio y presentación |
| Prescripciones | `/api/prescriptions` | Recetas médicas emitidas por un doctor en una cita |
| Detalle de prescripción | `/api/prescriptionDetail` | Medicamentos incluidos en una prescripción |
| Procedimientos | `/api/procedure` | Procedimientos médicos realizados en una cita |
| Pagos | `/api/payment` | Pagos asociados a citas (efectivo, tarjeta, transferencia) |

### Módulos de autorización

| Módulo | Ruta base |
|---|---|
| Usuarios | `/api/users` |
| Roles | `/api/roles` |
| Recursos | `/api/resources` |
| Asignación de roles | `/api/roleUsers` |
| Permisos de roles | `/api/resourceRoles` |

---

## Modelo de datos

```
Specialty ──< Doctor ──< Appointment >── Patient
                              │
              ┌───────────────┼───────────────────┐
              │               │                   │
           Diagnosis      Procedure           Prescription ──< PrescriptionDetail >── Medicine
                                                  │
                                               Payment
```

### Relaciones principales

- Una `Specialty` tiene muchos `Doctor`
- Un `Doctor` y un `Patient` tienen muchas `Appointment`
- Una `Appointment` puede tener muchos `Diagnosis`, `Procedure`, `Prescription` y un `Payment`
- Una `Prescription` tiene muchos `PrescriptionDetail`, cada uno asociado a un `Medicine`

---

## Base de datos

Configurado para **MySQL** por defecto. Los drivers de otras bases de datos están instalados:

| Base de datos | Driver | Estado |
|---|---|---|
| MySQL | `mysql2` | Configurado por defecto |
| PostgreSQL | `pg`, `pg-hstore` | Disponible — modifica el `dialect` en `src/database/db.ts` |
| Oracle | `oracledb` | Disponible — modifica el `dialect` en `src/database/db.ts` |
| SQL Server | `tedious` | Disponible — modifica el `dialect` en `src/database/db.ts` |

---

## Datos de prueba

El proyecto incluye un script para poblar la base de datos con datos ficticios usando **Faker**.

El orden de ejecución importa por las dependencias entre tablas:

```
1. Especialidades
2. Médicos
3. Pacientes
4. Citas médicas
5. Diagnósticos
6. Procedimientos
7. Medicamentos
8. Prescripciones
9. Detalle de prescripciones
10. Pagos
```

Para ejecutar, descomenta las funciones en `src/faker/populate_data.ts` en orden y ejecuta:

```bash
npx ts-node src/faker/populate_data.ts
```

También puedes probar los endpoints con los archivos `.http` en `src/http/`, compatibles con la extensión **REST Client** de VS Code.

---

## Testing

Tests automatizados con **Jest + ts-jest**. Corren completamente con mocks, **sin necesidad de una base de datos**, por lo que funcionan en cualquier máquina y en CI.

```bash
npm test              # corre todos los tests
npm run test:coverage # con reporte de cobertura
```

Cubren lo más crítico del proyecto:

- **RBAC** (`authMiddleware` y `validateAuthorization`): rechazo sin token / token expirado / inválido / usuario inactivo (401), sin permiso (403) y acceso autorizado.
- **Middleware de validación** y **esquemas de Zod** (login / register).

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| `npm start` | Ejecuta la versión compilada (`dist/server.js`) |
| `npm test` | Corre la suite de tests con Jest |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

---

## Contribución

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b feature/nombre-del-cambio`
3. Haz commit siguiendo Conventional Commits: `git commit -m "feat: descripción"`
4. Sube la rama: `git push origin feature/nombre-del-cambio`
5. Abre un Pull Request

---

## Licencia

Proyecto académico — Universidad de La Guajira, Ingeniería de Sistemas.
