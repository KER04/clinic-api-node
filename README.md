# 🏥 Backend IPS — API REST

API REST para la gestión integral de una **Institución Prestadora de Salud (IPS)**, desarrollada con **Node.js**, **TypeScript**, **Express** y **Sequelize**. Incluye autenticación JWT y control de acceso basado en roles (RBAC).

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| Runtime | Node.js |
| Lenguaje | TypeScript |
| Framework | Express |
| ORM | Sequelize |
| Base de datos | MySQL (también soporta PostgreSQL y Oracle) |
| Autenticación | JSON Web Tokens (JWT) + Refresh Tokens |
| Seguridad | bcryptjs, RBAC |
| Utilitarios | dotenv, cors, morgan |

---

## 📁 Estructura del proyecto

```
backend_node/
├── src/
│   ├── server.ts               # Punto de entrada
│   ├── config/
│   │   └── index.ts            # Configuración de Express, middlewares y rutas
│   ├── database/
│   │   └── db.ts               # Configuración de Sequelize
│   ├── routes/
│   │   ├── index.ts            # Registro central de rutas
│   │   ├── doctor.ts
│   │   ├── patient.ts
│   │   ├── appointment.ts
│   │   ├── specialty.ts
│   │   ├── diagnosis.ts
│   │   ├── medicine.ts
│   │   ├── payment.ts
│   │   ├── prescriptions.ts
│   │   ├── prescriptionDetail.ts
│   │   ├── procedure.ts
│   │   └── authorization/
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── role.ts
│   │       ├── resource.ts
│   │       ├── roleUser.ts
│   │       ├── resourceRole.ts
│   │       └── refresh_token.ts
│   ├── controller/             # Lógica de negocio por entidad
│   ├── models/                 # Modelos Sequelize
│   ├── middleware/
│   │   └── auth.ts             # Validación JWT + RBAC
│   ├── http/                   # Archivos .http para pruebas de endpoints
│   └── populate_data.ts        # Script para generar datos de prueba (faker)
├── .env                        # Variables de entorno (no subir al repositorio)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Instalación y configuración

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

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=ips_db
DB_TIMEZONE=America/Bogota

JWT_SECRET=tu_secreto_seguro_aqui
```

> **⚠️ Importante:** Nunca subas el archivo `.env` al repositorio. Asegúrate de que está incluido en `.gitignore`.

### 4. Crear la base de datos

```sql
CREATE DATABASE ips_db;
```

Sequelize sincronizará automáticamente las tablas al iniciar el servidor en modo desarrollo.

---

## 🚀 Uso

### Modo desarrollo

```bash
npm run dev
```

Usa `nodemon` con `ts-node` para recargar automáticamente al guardar cambios.

### Compilar para producción

```bash
npm run build
```

Genera los archivos JavaScript en la carpeta `dist/`.

> **Nota:** No existe un script `start` en `package.json`. Para producción, ejecuta directamente `node dist/server.js` tras compilar.

---

## 🔐 Autenticación y autorización

El sistema implementa autenticación mediante **JWT** y autorización con **RBAC** (Role-Based Access Control).

### Flujo de autenticación

1. El cliente hace `POST /api/login` con sus credenciales.
2. El servidor devuelve un `accessToken` y un `refreshToken`.
3. Las rutas protegidas requieren el header:
   ```
   Authorization: Bearer <accessToken>
   ```
4. Cuando el `accessToken` expira, usa `GET /refresk-token` para renovarlo.

### Middleware de validación

El middleware `auth.ts` verifica en cada petición protegida:
- Que el token JWT sea válido y esté firmado con `JWT_SECRET`.
- Que el usuario esté activo en la base de datos.
- Que el usuario tenga permisos RBAC para la ruta y método HTTP solicitados.

### Modelos de seguridad

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuarios del sistema |
| `Role` | Roles disponibles |
| `Resource` | Recursos/rutas protegidas |
| `RoleUser` | Asignación de roles a usuarios |
| `ResourceRole` | Permisos de roles sobre recursos |
| `RefreshToken` | Tokens de refresco almacenados |

---

## 📡 Endpoints

### Autenticación pública

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/register` | Registro de nuevo usuario |
| `POST` | `/api/login` | Inicio de sesión |
| `GET` | `/refresk-token` | Renovar access token |

> **Nota:** La ruta de refresh token tiene un typo intencional del código fuente (`refresk` en lugar de `refresh`).

### Patrón de rutas por módulo

Cada entidad expone rutas públicas (sin autenticación) y rutas protegidas (requieren JWT + RBAC):

```
GET    /api/<recurso>/public        → Listar todos (público)
GET    /api/<recurso>/public/:id    → Obtener por ID (público)
GET    /api/<recurso>               → Listar todos (protegido)
GET    /api/<recurso>/:id           → Obtener por ID (protegido)
POST   /api/<recurso>               → Crear (protegido)
PUT    /api/<recurso>/:id           → Actualizar (protegido)
DELETE /api/<recurso>/:id           → Eliminar (protegido)
```

### Módulos disponibles

| Módulo | Ruta base |
|--------|-----------|
| Médicos | `/api/doctor` |
| Pacientes | `/api/patient` |
| Citas médicas | `/api/appointment` |
| Especialidades | `/api/specialty` |
| Diagnósticos | `/api/diagnosis` |
| Medicamentos | `/api/medicine` |
| Pagos | `/api/payment` |
| Prescripciones | `/api/prescriptions` |
| Detalle de prescripciones | `/api/prescriptionDetail` |
| Procedimientos | `/api/procedure` |

### Módulos de autorización (protegidos)

| Módulo | Ruta base |
|--------|-----------|
| Usuarios | `/api/users` |
| Roles | `/api/roles` |
| Recursos | `/api/resources` |
| Asignación de roles | `/api/roleUsers` |
| Permisos de roles | `/api/resourceRoles` |

---

## 🗄️ Base de datos

El proyecto está configurado para **MySQL** por defecto. Sin embargo, incluye drivers para otras bases de datos:

| Base de datos | Driver | Estado |
|---------------|--------|--------|
| MySQL | `mysql2` | ✅ Configurado por defecto |
| PostgreSQL | `pg`, `pg-hstore` | ⚙️ Disponible (requiere ajuste en `db.ts`) |
| Oracle | `oracledb` | ⚙️ Disponible (requiere ajuste en `db.ts`) |

Para cambiar el dialecto, modifica la configuración en `src/database/db.ts`.

---

## 🧪 Datos de prueba

El proyecto incluye un script para poblar la base de datos con datos ficticios usando **Faker**:

```bash
npx ts-node src/populate_data.ts
```

También puedes probar los endpoints directamente con los archivos `.http` incluidos en la carpeta `src/http/`, compatibles con la extensión **REST Client** de VS Code.

---

## 📋 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a JavaScript |

---

## 🤝 Contribución

1. Haz fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m "feat: descripción del cambio"`
4. Sube la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto es de uso académico. Universidad de La Guajira — Ingeniería de Sistemas.