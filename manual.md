# 📘 SYSTEM DOCUMENTATION

## 1. Project Information

Project Name:\
backend_node

Student Name: Kevin Estrada

Course: Desarrollo Web

Semester: 8 semestre

Date:\
2025-11-17

Instructor: Jaider quintero

Short Project Description:
A TypeScript-based Express backend for a healthcare domain. The system manages appointments, patients, doctors, prescriptions, payments, diagnoses, procedures, specialties and medicines, and includes an authorization subsystem with users, roles, resources, role assignments and refresh tokens.

## 2. System Architecture Overview

### 2.1 Architecture Description

The backend is a RESTful API built with Node.js and TypeScript. It uses Express as the HTTP server and Sequelize as ORM to interact with a relational database (MySQL or PostgreSQL). Authentication is implemented using JWTs and a refresh-token mechanism; authorization is role-based (RBAC) and enforced via middleware that checks resources and allowed methods.

Key runtime flows:
- Client -> HTTP request -> Express routes -> Controllers -> Sequelize models -> Database
- Authentication: `/api/login` issues JWT token; protected routes require `Authorization: Bearer <token>` and are validated by `src/middleware/auth.ts` which consults RBAC tables.

### 2.2 Technologies Used

- Frontend: N/A (no frontend present in repository)
- Backend: Node.js, TypeScript, Express, Sequelize
- Database Engine: MySQL or PostgreSQL (drivers `mysql2`, `pg`, `pg-hstore` present)
- Additional Libraries / Tools: `jsonwebtoken` (JWT), `cors`, `morgan`, `nodemon`, `ts-node`, `typescript`

### 2.3 Visual explanation of the system’s operation

```
Client (REST Client / Frontend)
      |
      |  HTTP requests (JSON)
      v
Express server (src/server.ts -> src/config/index.ts)
      |
      |  Routes defined in src/routes/ -> controllers in src/controller/
      v
Controllers (business logic) -> Sequelize models (src/models/)
      |
      v
Relational Database (MySQL / Postgres)

Authorization:
  - JWT token issued by /api/login
  - Middleware `src/middleware/auth.ts` validates token and calls RBAC checks
```

## 3. Database Documentation (ENGLISH)

### 3.1 Database Description

The application uses a relational database to store domain entities and RBAC tables. The dialect can be configured (MySQL or PostgreSQL). Models include domain tables for doctors, patients, appointments, specialties, prescriptions, prescription details, diagnoses, procedures, medicines, payments, and authorization tables for users, roles, resources, role assignments, and refresh tokens.

### 3.2 ERD – Entity Relationship Diagram

(High-level relationships; detailed ERD not included here)
- `Doctor` has many `Appointment` and `Prescription`.
- `Patient` has many `Appointment` and `Diagnosis`.
- `Appointment` may have `Procedure` and `Payment`.
- `Prescription` has many `PrescriptionDetail` which references `Medicine`.
- RBAC: `User` <-> `Role` (RoleUser), `Resource` <-> `Role` (ResourceRole).

### 3.3 Logical Model

Tables represent entities below; most have a status field (`ACTIVE` / `INACTIVE`) and standard integer `id` PKs.

### 3.4 Physical Model (Tables)

| Table | Column | Type | PK/FK | Description |
|-------|--------|------|-------|-------------|
| `doctors` | `id` | integer | PK | Primary key |
|  | `first_name` | string |  | Doctor first name |
|  | `last_name` | string |  | Doctor last name |
|  | `document` | string |  | Identification document |
|  | `phone` | string |  | Phone number (nullable) |
|  | `email` | string |  | Email (nullable) |
|  | `medical_license` | string |  | Medical license code |
|  | `specialty_id` | integer | FK -> `specialties.id` | Specialty reference |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `patients` | `id` | integer | PK | Primary key |
|  | `first_name` | string |  | Patient first name |
|  | `last_name` | string |  | Patient last name |
|  | `document` | string |  | Identification document |
|  | `birth_date` | date |  | Birth date |
|  | `phone` | string |  | Phone (nullable) |
|  | `email` | string |  | Email (nullable) |
|  | `address` | string |  | Address (nullable) |
|  | `gender` | string |  | 'M' or 'F' |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `appointments` | `id` | integer | PK | Primary key |
|  | `patient_id` | integer | FK -> `patients.id` | Patient reference |
|  | `doctor_id` | integer | FK -> `doctors.id` | Doctor reference |
|  | `appointment_datetime` | datetime |  | Appointment date/time |
|  | `consultation_reason` | string |  | Reason for consultation (nullable) |
|  | `observations` | string |  | Observations (nullable) |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `specialties` | `id` | integer | PK | Primary key |
|  | `specialty_name` | string |  | Name |
|  | `description` | string |  | Description |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `prescriptions` | `id` | integer | PK | Primary key |
|  | `appointment_id` | integer | FK -> `appointments.id` | Appointment reference |
|  | `doctor_id` | integer | FK -> `doctors.id` | Doctor reference |
|  | `issue_date` | date |  | Issue date |
|  | `general_instructions` | string |  | Instructions (nullable) |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `prescription_details` | `id` | integer | PK | Primary key |
|  | `prescription_id` | integer | FK -> `prescriptions.id` | Prescription reference |
|  | `medicine_id` | integer | FK -> `medicines.id` | Medicine reference |
|  | `quantity` | integer |  | Quantity |
|  | `dosage` | string |  | Dosage text |
|  | `treatment_days` | integer |  | Treatment duration in days |
|  | `special_instructions` | string |  | Nullable special instructions |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `diagnoses` | `id` | integer | PK | Primary key |
|  | `patient_id` | integer | FK -> `patients.id` | Patient reference |
|  | `appointment_id` | integer | FK -> `appointments.id` | Appointment reference |
|  | `icd10_code` | string |  | ICD-10 code |
|  | `description` | string |  | Description |
|  | `diagnosis_date` | date |  | Diagnosis date |
|  | `observations` | string |  | Nullable observations |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `procedures` | `id` | integer | PK | Primary key |
|  | `appointment_id` | integer | FK -> `appointments.id` | Appointment reference |
|  | `procedure_code` | string |  | Procedure code |
|  | `procedure_name` | string |  | Name |
|  | `description` | string |  | Description |
|  | `cost` | decimal |  | Cost |
|  | `performed_date` | date |  | Date performed |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `medicines` | `id` | integer | PK | Primary key |
|  | `commercial_name` | string |  | Commercial name |
|  | `generic_name` | string |  | Generic name |
|  | `concentration` | string |  | Concentration |
|  | `pharmaceutical_form` | string |  | Form (tablet, syrup, etc.) |
|  | `laboratory` | string |  | Manufacturer |
|  | `unit_price` | decimal |  | Price |
|  | `status` | string |  | ACTIVE / INACTIVE |

| `payments` | `id` | integer | PK | Primary key |
|  | `appointment_id` | integer | FK -> `appointments.id` | Appointment reference |
|  | `total_amount` | decimal |  | Total amount |
|  | `consultation_amount` | decimal |  | Consultation fee |
|  | `procedures_amount` | decimal |  | Procedures fees |
|  | `payment_method` | string |  | e.g., TARJETA, EFECTIVO |
|  | `payment_date` | date |  | Payment date |
|  | `payment_status` | string |  | e.g., COMPLETADO |
|  | `invoice_number` | string |  | Invoice identifier |
|  | `status` | string |  | ACTIVE / INACTIVE |

Authorization tables (high level):
| `users` | common user fields |  | PK | Users in the system (username, email, password hash, avatar, is_active) |
| `roles` | `id`, `name`, `is_active` |  | PK | Roles available in the system |
| `resources` | `id`, `path`, `method`, `is_active` |  | PK | API resources protected by RBAC |
| `resource_roles` | mapping |  | FK | Mapping between resources and roles |
| `role_users` | mapping |  | FK | Mapping between users and roles |
| `refresh_tokens` | tokens |  | FK | Stored refresh tokens for users

> Note: The column lists above are inferred from model files and controllers; for exact column types and constraints, consult `src/models/*.ts`.

## 4. Use Cases – CRUD

### 4.1 Use Case: Create Doctor
Actor:\
- Admin user (authenticated, authorized role)

Description:\
Create a new doctor record in the system.

Preconditions:\
- User is authenticated and has a role with permission to create doctors.
- Required fields provided: `first_name`, `last_name`, `medical_license`, `specialty_id`.

Postconditions:\
- Doctor record exists in `doctors` table with status `ACTIVE`.

Main Flow:
1. Client sends `POST /api/doctor` with JSON payload.
2. Auth middleware validates JWT and RBAC for the route.
3. Controller validates payload and calls model to create the doctor.
4. Controller responds `201 Created` with the created doctor object.

### 4.2 Use Case: Read Doctor (List)
Actor:
- Public user (public endpoint) or authenticated user (authenticated endpoint)

Description:
Retrieve list of doctors.

Preconditions:
- For public listing, no auth required. For admin listing, valid JWT required.

Main Flow:
1. Client requests `GET /api/doctor/public` or `GET /api/doctor`.
2. Controller fetches doctors from DB (filters by status active, if applicable).
3. Controller returns `200 OK` with array of doctor objects.

### 4.3 Use Case: Update Doctor
Actor:
- Admin user

Description:
Update existing doctor data.

Preconditions:
- Doctor id exists.
- User has proper authorization.

Main Flow:
1. Client sends `PUT /api/doctor/{id}` with updated fields.
2. Auth middleware validates permissions.
3. Controller updates doctor record and returns `200 OK` with updated object.

### 4.4 Use Case: Delete Doctor (Logical)
Actor:
- Admin user

Description:
Soft-delete a doctor by setting status to `INACTIVE`.

Preconditions:
- Doctor id exists.

Main Flow:
1. Client sends `DELETE /api/doctor/{id}`.
2. Auth middleware validates permissions.
3. Controller sets `status = INACTIVE` and returns `200 OK` with a success message.

(Repeat analogous CRUD use cases exist for `Patient`, `Appointment`, `Prescription`, `Procedure`, etc.)

## 5. Backend Documentation

### 5.1 Backend Architecture

- Single Node.js process using Express.
- Controllers provide HTTP handlers and coordinate business logic.
- Sequelize models implemented under `src/models/` provide DB mapping.
- RBAC enforced centrally in `src/middleware/auth.ts`.

### 5.2 Folder Structure

```
src/
  server.ts
  config/
    index.ts
  controller/
    Authorization/
      auth.controller.ts
      refresh_token.controller.ts
      resource.controller.ts
      resourceRole.controller.ts
      role.controller.ts
      role_user.controller.ts
      user.controller.ts
    appointment.controller.ts
    diagnosis.controller.ts
    doctor.controller.ts
    medicine.controller.ts
    patients.controller.ts
    payment.controller.ts
    prescription.controller.ts
    prescriptionDetail.controller.ts
    procedure.controller.ts
    specialty.controller.ts
  database/
    db.ts
  models/
    index.ts
    appointment.ts
    diagnosis.ts
    doctor.ts
    medicine.ts
    patient.ts
    payment.ts
    prescription.ts
    prescriptiondetail.ts
    procedure.ts
    specialty.ts
    authorization/
      RefreshToken.ts
      relation.ts
      resource.ts
      ResourceRole.ts
      role.ts
      RoleUser.ts
      user.ts
  routes/
    (route files per resource, plus authorization/ subfolder)
  middleware/
    auth.ts
  http/
    (*.http request templates)

```

### 5.3 API Documentation (REST)

Method Path: `POST /api/login`

Purpose:\
Authenticate a user and return a JWT.

Request Body Example:

```json
{
  "email": "jq@gmail.com",
  "password": "12345678"
}
```

Responses:
- `200 OK` — returns `{ user: User, token: string }`
- `401 Unauthorized` — invalid credentials


Method Path: `POST /api/doctor` (authenticated)

Purpose:\
Create a new doctor record.

Request Body Example:

```json
{
  "first_name": "Prueba3",
  "last_name": "blablaaa",
  "document": "8351941",
  "phone": "294255517296550",
  "email": "bala@yahoo.com",
  "medical_license": "DCC3OH39S",
  "specialty_id": 2,
  "status": "ACTIVE"
}
```

Responses:
- `201 Created` — created doctor object plus message
- `400 Bad Request` — validation errors
- `401 Unauthorized` — not authenticated / not authorized

### 5.4 REST Client

There are `.http` files under `src/http/` and `src/http/authorization/` that can be used with the VS Code REST Client extension or copied into tools like Postman / Insomnia.

## 6. Frontend Documentation

### 6.1 Technical Frontend Documentation

Framework Used:\
- None in this repository. The project is backend-only.

Folder Structure:

```
No frontend present in this repo.
```

Models, services and Components

- Not applicable for this repository.

### 6.2 Visual explanation of the system’s operation

- Not applicable (backend-only project).

## 7. Frontend–Backend Integration

- Integration is via RESTful endpoints described in section 5. The client must obtain a JWT using `/api/login` and include the `Authorization: Bearer <token>` header for protected endpoints. Use the example `.http` files in `src/http/` for request examples.

## 8. Conclusions & Recommendations

- Add a `README.md` with environment variables and quick-start instructions.
- Add explicit `npm` scripts for `build` and `start` for production usage.
- Introduce migration tooling (Sequelize CLI or Umzug) instead of relying only on model sync.
- Harden security by requiring `JWT_SECRET` in environment and documenting env vars.
- Add tests (unit and integration) and a CI pipeline.
- Optionally generate an OpenAPI (Swagger) definition from the routes and models for better client integration.

## 9. Annexes (Optional)

- Files to review for implementation details:
  - `src/config/index.ts`
  - `src/middleware/auth.ts`
  - `src/database/db.ts`
  - `src/models/` and `src/controller/`
  - `src/http/` (request examples)


---

*Document generated from repository analysis on 2025-11-17.*
