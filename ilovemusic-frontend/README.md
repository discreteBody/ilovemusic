
# ILoveMusic Frontend

Frontend web app for **ILoveMusic** — a music playlist manager with Spotify/YouTube authentication and playlist tools.

This project is a **Vite + React + TypeScript** app, using:
- **React Router** for routing
- **TanStack React Query** for server state/data fetching
- **Tailwind CSS** + **shadcn/ui (Radix UI)** for UI components
- **Zustand** for client state (where needed)
- **Vitest** for unit tests

> Backend: see `ilovemusic-backend/` in this repo (Spring Boot).

---

## Prerequisites

- Node.js (recommended: latest LTS)
- npm (or your preferred package manager)

---

## Getting Started

### Install dependencies

```bash
cd ilovemusic-frontend
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite will print the local dev URL (commonly `http://localhost:5173`).

---

## Build & Preview

### Production build

```bash
npm run build
```

### Development-mode build

```bash
npm run build:dev
```

### Preview the build locally

```bash
npm run preview
```

---

## Scripts

From `package.json`:

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run build:dev` — build using development mode
- `npm run preview` — preview built app
- `npm run lint` — run ESLint
- `npm run test` — run unit tests once (Vitest)
- `npm run test:watch` — run Vitest in watch mode

---

## Environment Variables

Create an `.env` file in `ilovemusic-frontend/` (Vite requires variables to be prefixed with `VITE_`).

Example:

```bash
# Backend API base URL (example)
VITE_API_BASE_URL=http://localhost:8080

# If using Google OAuth on the frontend (example)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> Exact environment variable names depend on how the frontend code reads configuration.  
> If you tell me what files handle API calls/auth (or I can inspect them), I can tailor this section precisely.

---

## Tech Stack (high level)

- **Vite 5**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui + Radix UI**
- **React Router**
- **TanStack React Query**
- **Zod** + **React Hook Form**
- **Vitest**

---

## Contributing

1. Create a feature branch
2. Commit changes with clear messages
3. Open a pull request

---

## License

MIT (if the repository license is MIT).