# Saim Portfolio Monolith

A monolithic full-stack portfolio built with Node.js, Express, React, PostgreSQL, and Nodemailer.

## Features
- Animated light-themed portfolio homepage
- DevOps and cybersecurity skill showcase
- Login / register with PostgreSQL persistence
- Contact form that stores messages in PostgreSQL and sends an email with SMTP
- Admin-ready API structure
- Dockerized for server deployment

## Stack
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt, Nodemailer
- **Frontend:** React, Vite, Framer Motion, Lucide React
- **Database:** PostgreSQL

## Quick Start

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment
Copy `server/.env.example` to `server/.env` and set your values.

### 3. Start PostgreSQL
Use your own PostgreSQL instance or run:
```bash
docker compose up -d postgres
```

### 4. Initialize database
```bash
npm run db:init
```

### 5. Run development servers
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Production Build
```bash
npm run build
npm start
```

The Express server serves the React build from `client/dist`.

## Deployment Notes
- Point your reverse proxy to the Node app port.
- Set `CLIENT_URL` to your live domain.
- Configure SMTP credentials in `server/.env`.
- Use a managed PostgreSQL instance or the included Docker Compose file.

## Main Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/profile`
- `POST /api/messages`
- `GET /api/health`
# saim-portfolio
