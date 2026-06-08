# Primetrade AI — Full-Stack Internship Assignment

This project is a secure full-stack task manager with:

- Backend: Node.js + Express + PostgreSQL (Prisma)
- Auth: JWT with bcrypt (JWT stored in an HttpOnly cookie)
- API docs: Swagger at `/api/docs`
- Frontend: React (Vite) with Register, Login, and JWT-protected Dashboard

## Project layout

- `/backend` — Express API (JWT auth, RBAC, tasks CRUD)
- `/frontend` — React Vite app

## Prerequisites

- Docker + Docker Compose
- (Optional) Node.js for running locally

## Environment variables

Backend environment variables are in:

- `backend/.env.example`

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Set a strong `JWT_SECRET` (at least 32 characters).

## Database migration (required)

Run Prisma migrations to create tables in PostgreSQL:

```bash
cd backend
npx prisma migrate dev --name init
```

## Run everything with Docker (full stack)

Start PostgreSQL, backend, and frontend with one command:

```bash
docker compose up --build
```

Optional: set a custom `JWT_SECRET` in a root `.env` file (see `.env.example`).

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |
| Swagger  | http://localhost:3000/api/docs |
| Health   | http://localhost:3000/health |

The backend runs `prisma migrate deploy` on startup. The frontend nginx container proxies `/api` to the backend so HttpOnly cookies work on the same origin.

For scaling notes, see [SCALABILITY.md](./SCALABILITY.md).

## JWT + authorization model

- `POST /api/v1/auth/register` creates a **user** (role = `user`).
- `POST /api/v1/auth/login` returns the user and sets a JWT in an **HttpOnly cookie** named `token`.
- All endpoints under `GET/POST/PUT/DELETE /api/v1/tasks` are JWT-protected.
- Role-based access:
  - `user` can CRUD only their own tasks
  - `admin` can CRUD any task and can delete any task

### Creating an admin

Admin accounts are created automatically when registering with the email configured in `ADMIN_EMAIL` (see `backend/.env.example`).

### Token transport

For convenience/testing, the backend accepts JWT from either:

1. HttpOnly cookie: `token`
2. `Authorization: Bearer <jwt>` header (used by Swagger + Postman)

## Postman

A Postman collection file is included at:

- `postman_collection.json`

Import it into Postman to quickly try the auth + tasks endpoints.

## Frontend (React + Vite)

The frontend uses **HttpOnly cookies** for JWT storage. All API calls use `credentials: 'include'`.

### Local development

1. Start PostgreSQL and run migrations (see above).
2. Start the backend on port `3000`:

```bash
cd backend
cp .env.example .env
# edit JWT_SECRET (32+ chars)
npm run dev
```

3. Start the frontend (Vite proxies `/api` to the backend):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Pages

- `/register` — create an account (auto-login via HttpOnly cookie)
- `/login` — sign in
- `/dashboard` — protected task CRUD with success/error toasts
