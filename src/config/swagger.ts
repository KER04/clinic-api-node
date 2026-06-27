import swaggerJsdoc from "swagger-jsdoc";

const definition: swaggerJsdoc.Options["definition"] = {
  openapi: "3.0.3",
  info: {
    title: "API Backend IPS",
    version: "1.0.0",
    description:
      "API REST de una IPS (institución de salud). Autenticación JWT, control de acceso por roles (RBAC) " +
      "dinámico, soft-deletes y validación con Zod.\n\n" +
      "**Nota:** las entidades del dominio (patient, specialty, medicine, appointment, diagnosis, " +
      "prescription, prescriptiondetail, procedure, payment) siguen el mismo patrón CRUD que `doctor`, " +
      "documentado aquí como ejemplo: rutas `/public` sin token y rutas protegidas con `Bearer`.",
  },
  servers: [{ url: "http://localhost:3000", description: "Desarrollo local" }],
  tags: [
    { name: "Auth", description: "Registro, login y refresh token" },
    { name: "Health", description: "Estado del servidor" },
    { name: "Doctores", description: "CRUD de doctores (patrón representativo del resto de entidades)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtenido en /api/login. Enviar como: Authorization: Bearer <token>",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string", example: "Mensaje de error" } },
      },
      ValidationError: {
        type: "object",
        properties: {
          errors: {
            type: "object",
            additionalProperties: { type: "array", items: { type: "string" } },
            example: { email: ["El email no es válido"], password: ["La contraseña es obligatoria"] },
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "ker@ker.com" },
          password: { type: "string", example: "12345678" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 2, example: "ker" },
          email: { type: "string", format: "email", example: "ker@ker.com" },
          password: { type: "string", minLength: 6, example: "12345678" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "ker" },
          email: { type: "string", example: "ker@ker.com" },
          is_active: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
        },
      },
      Doctor: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          first_name: { type: "string", example: "Juan" },
          last_name: { type: "string", example: "Pérez" },
          document: { type: "string", example: "1234567890" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "juan@ips.com" },
          medical_license: { type: "string", example: "ML-0001" },
          specialty_id: { type: "integer", example: 3 },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
        },
      },
      DoctorInput: {
        type: "object",
        required: ["first_name", "last_name", "document", "medical_license", "specialty_id"],
        properties: {
          first_name: { type: "string", minLength: 2, example: "Juan" },
          last_name: { type: "string", minLength: 2, example: "Pérez" },
          document: { type: "string", example: "1234567890" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "juan@ips.com" },
          medical_license: { type: "string", example: "ML-0001" },
          specialty_id: { type: "integer", example: 3 },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
        },
      },
      PaginatedDoctors: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Doctor" } },
          total: { type: "integer", example: 50 },
          page: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 3 },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Estado del servidor",
        responses: {
          "200": {
            description: "El servidor está activo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    uptime: { type: "number", example: 123.45 },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar un nuevo usuario",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } },
        },
        responses: {
          "201": {
            description: "Usuario creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          "400": {
            description: "Datos inválidos",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } },
          },
        },
      },
    },
    "/api/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión",
        description: "Devuelve un access token (60 min). Limitado a 5 intentos cada 15 minutos por IP.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
        },
        responses: {
          "200": {
            description: "Login exitoso",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          "400": {
            description: "Datos inválidos",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } },
          },
          "401": {
            description: "Credenciales inválidas",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          "429": { description: "Demasiados intentos (rate limit)" },
        },
      },
    },
    "/api/doctor/public": {
      get: {
        tags: ["Doctores"],
        summary: "Listar doctores activos (paginado, público)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Número de página" },
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 }, description: "Registros por página" },
        ],
        responses: {
          "200": {
            description: "Lista paginada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedDoctors" } } },
          },
        },
      },
      post: {
        tags: ["Doctores"],
        summary: "Crear un doctor (público)",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DoctorInput" } } },
        },
        responses: {
          "201": { description: "Doctor creado" },
          "400": {
            description: "Datos inválidos",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } },
          },
        },
      },
    },
    "/api/doctor/public/{id}": {
      get: {
        tags: ["Doctores"],
        summary: "Obtener un doctor por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Doctor encontrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Doctor" } } },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Doctores"],
        summary: "Actualizar un doctor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DoctorInput" } } },
        },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } },
      },
      delete: {
        tags: ["Doctores"],
        summary: "Eliminar (soft-delete) un doctor",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Marcado como INACTIVE" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/doctor": {
      get: {
        tags: ["Doctores"],
        summary: "Listar doctores (protegido — requiere token y permiso RBAC)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Lista paginada",
            content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedDoctors" } } },
          },
          "401": { description: "Sin token o token inválido" },
          "403": { description: "Sin permiso para este recurso" },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({ definition, apis: [] });
