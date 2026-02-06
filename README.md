# Inventory Management System

Modern supermarket inventory platform with Spring Boot, PostgreSQL, Vue 3, and JWT-based security. It covers product/category catalogs, stock movements, and role-aware user access.

## Features

- **Product & Category Management**: CRUD for products with SKU codes, categories, images, search/filter, and pagination.
- **Inventory & Stock Control**: Stock-in/out operations, automatic quantity math, movement history, and negative-stock prevention.
- **User Authentication & Access Control**: JWT login, Admin/Staff roles, protected APIs and routes.
- **Dashboard & Reporting**: Summary cards (totals, low stock, stock value) and recent activity.
- **Responsive Frontend**: Vue 3 + Pinia UI with Tailwind styling and guarded routes.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL, Gradle, JWT.
- **Frontend**: Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS.

## Project Layout

- `API/` – Spring Boot service (REST APIs, JWT auth, PostgreSQL persistence).
- `Web/` – Vue 3 SPA consuming the API.

## Prerequisites

- Java 21+, Node.js 18+, npm
- PostgreSQL running locally (default connection `jdbc:postgresql://localhost:5432/supermarket`).

## Backend Setup (`API`)

1. Configure database in `API/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/supermarket
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   server.port=8080
   ```
2. From `API/`, build and run:
   ```bash
   ./gradlew clean bootRun
   ```
   API serves at `http://localhost:8080/api` and Swagger at `/swagger-ui.html`.

## Frontend Setup (`Web`)

1. Create env file:
   ```bash
   cd Web
   cp .env.example .env   # if present, otherwise create manually
   echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env
   ```
2. Install and start:
   ```bash
   npm install
   npm run dev
   ```
   App runs at `http://localhost:5173`.

## Authentication

- Default admin credentials (dev): `admin / admin123`.
- JWT stored in `localStorage`; `Authorization: Bearer <token>` is injected automatically by the frontend client.

## Key Endpoints (API)

- `POST /api/login` – obtain JWT.
- `GET /api/products` – paginated product list (supports `keyword`, `categoryId`, `page`, `size`, `sortBy`, `sortDir`).
- `POST /api/products` – create product (multipart with image).
- `GET /api/categories` – paginated categories.
- `POST /api/admin/users` – admin-only user creation.
- `GET /api/reports/summary` – dashboard stats (auth required).

## Stock Control Concepts

- Stock movements recorded with type `IN` or `OUT`.
- Negative balances are blocked; requests that would drop quantity below zero are rejected.
- Movement history is queryable per product for auditability.

## Running Tests

- Backend: `cd API && ./gradlew test`
- Frontend: `cd Web && npm test` (or `npm run lint` if tests not defined).

## Common Issues

- **Port in use**: stop processes on 8080 (API) or 5173 (Web) before starting.
- **CORS/auth errors**: confirm `VITE_API_BASE_URL` matches the backend host and JWT is present; retry login.
- **Database connection**: verify PostgreSQL credentials and database existence.

## Folder References

- Backend docs: `API/README.md`, `API/frontend-guide.md`.
- Frontend docs: `Web/README.md`.

## License

Educational use; customize as needed for production.
