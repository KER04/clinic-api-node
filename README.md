# Backend IPS - Sistema de Gestión Médica

API REST para la gestión integral de una **IPS (Institución Prestadora de Salud)**, que administra citas médicas, pacientes, médicos, especialidades, diagnósticos, medicamentos, prescripciones, procedimientos y pagos, con un sistema de autenticación y autorización basado en roles.

Proyecto académico (Universidad de La Guajira) usado como repositorio de práctica/portafolio.

## 🚀 Tecnologías

- **Node.js**
- **TypeScript**
- **Sequelize** (ORM)
- **MySQL**
- **JWT** (JSON Web Tokens) para autenticación
- npm como gestor de paquetes

## ⚙️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/KER04/clinic-api-node.git
cd backend_node
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz con las siguientes variables:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ips_db

JWT_SECRET=tu_clave_secreta
JWT_REFRESH_SECRET=tu_clave_secreta_refresh
JWT_EXPIRES_IN=1h
```

4. Crea la base de datos en MySQL y ejecuta las migraciones/sincronización de Sequelize (según cómo lo tengas configurado).

## ▶️ Uso

### Modo desarrollo
```bash
npm run dev
```

### Compilar
```bash
npm run build
```

### Producción
```bash
npm start
```

## 🔐 Autenticación y roles

El sistema usa **JWT** para autenticación, con **access token** y **refresh token**. El control de acceso está basado en un esquema de **roles y recursos**:

- `user` — usuarios del sistema
- `role` — roles disponibles (ej: admin, médico, paciente, recepción)
- `resource` — recursos/endpoints protegidos
- `role_user` — asignación de roles a usuarios
- `resourceRole` — permisos de cada rol sobre cada recurso

Flujo típico:
1. El usuario se autentica en `/auth/login` y recibe un access token + refresh token.
2. El access token se envía en cada request protegida (`Authorization: Bearer <token>`).
3. Cuando expira, se usa `/refresh_token` para obtener uno nuevo sin volver a iniciar sesión.
4. Cada request protegida valida, vía middleware, si el rol del usuario tiene permiso sobre el recurso solicitado.

## 📡 Módulos principales

| Módulo                | Descripción                                                 |
|------------------------|--------------------------------------------------------------|
| `appointment`           | Agendamiento y gestión de citas médicas                       |
| `doctor`                | Registro y administración de médicos                          |
| `patient`               | Registro y administración de pacientes                         |
| `specialty`              | Especialidades médicas disponibles                              |
| `diagnosis`              | Diagnósticos asociados a citas/pacientes                          |
| `medicine`                | Catálogo de medicamentos                                          |
| `prescription`            | Prescripciones médicas emitidas                                    |
| `prescriptionDetail`       | Detalle de cada medicamento dentro de una prescripción                |
| `procedure`                 | Procedimientos médicos realizados                                       |
| `payment`                    | Gestión de pagos asociados a citas/servicios                               |

> Cada módulo expone operaciones CRUD estándar (`GET`, `POST`, `PUT`, `DELETE`) sobre su recurso correspondiente.

## 🧪 Datos de prueba

El proyecto incluye un módulo `faker` para generar datos de prueba (pacientes, médicos, citas, etc.) durante el desarrollo.

## 📝 Licencia

Proyecto académico — Universidad de La Guajira.

## ✍️ Autor

Kevin Estrada Ricardo