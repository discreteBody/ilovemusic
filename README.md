# ILoveMusic

**ILoveMusic** is a full‑stack playlist management app that lets users authenticate, manage playlists + tracks, and connect music providers (Spotify and YouTube) to enable cross‑platform workflows.

This repository contains:

- `ilovemusic-backend/` — Spring Boot (Java) API + OAuth2 integrations + JWT auth + PostgreSQL persistence
- `ilovemusic-frontend/` — Vite + React + TypeScript web app (Tailwind + shadcn/ui)

> Note: At the referenced commit (`c7d9a7d8fdf5690ef35813f0d670a45397ef7be6`), the frontend README was empty, and the tooling I’m using couldn’t fetch a full repo tree listing. This README is generated from the backend README + the frontend `package.json` dependencies/scripts.

---

## Features (What the app does)

### Authentication & Accounts
- **User registration & login** with JWT-based authentication.
- **Refresh tokens** supported (via API endpoint) to keep sessions alive.
- **Logout** endpoint.
- **OAuth connections**:
    - Connect **Spotify** account (OAuth flow handled by backend).
    - Connect **YouTube/Google** account (OAuth flow handled by backend).
    - Endpoint to check which providers are connected.

Backend endpoints (from backend docs):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET /api/auth/connections`
- `GET /api/auth/spotify` + `GET /api/auth/spotify/callback`
- `GET /api/auth/youtube` + `GET /api/auth/youtube/callback`

### Playlist Management
- Create / list / read / update / delete playlists.
- Add / list / remove tracks within a playlist.
- Filter playlists by platform (optional query param mentioned in docs).
- Persist playlists/tracks in PostgreSQL via JPA.

Backend endpoints:
- `POST /api/v1/playlists`
- `GET /api/v1/playlists` (optional `platform` query param)
- `GET /api/v1/playlists/{playlistId}`
- `PUT /api/v1/playlists/{playlistId}`
- `DELETE /api/v1/playlists/{playlistId}`
- `POST /api/v1/playlists/{playlistId}/tracks`
- `GET /api/v1/playlists/{playlistId}/tracks`
- `DELETE /api/v1/playlists/{playlistId}/tracks/{trackId}`

### Cross‑platform Export
- Export a playlist between platforms (Spotify ↔ YouTube) via:
    - `POST /api/v1/playlists/export` with `playlistId`, `fromPlatform`, `toPlatform`

### UI / Frontend experience (from dependencies)
The frontend is built to support:
- Modern component UI (**shadcn/ui + Radix UI**) with **Tailwind CSS**
- Routing via **React Router**
- Async state/data fetching via **TanStack React Query**
- Form validation via **React Hook Form + Zod**
- Google OAuth client available via `@react-oauth/google`
- App state store available via **Zustand**

---

## Tech Stack

### Frontend (`ilovemusic-frontend/`)
- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS** (+ `tailwindcss-animate`)
- **shadcn/ui** (Radix UI component primitives)
- **React Router**
- **TanStack React Query**
- **Zustand**
- **Vitest** for unit tests
- ESLint for linting

Frontend scripts:
- `npm run dev`
- `npm run build`
- `npm run build:dev`
- `npm run preview`
- `npm run lint`
- `npm run test` / `npm run test:watch`

### Backend (`ilovemusic-backend/`)
- **Spring Boot 3.3.5**
- **Spring Security** (JWT + OAuth2)
- **PostgreSQL** + **Spring Data JPA (Hibernate)**
- **JJWT** (`0.12.3` referenced in backend docs)
- Java **17+**
- Uses `.env` optionally via Spring config import

---

## Project Structure (high level)

### Backend (documented)
```
ilovemusic-backend/
├── src/main/java/com/ilovemusic/
│   ├── config/            # SecurityConfig, JWT filter, app config
│   ├── controller/        # AuthController, PlaylistController
│   ├── entity/            # User, OAuthToken, Playlist, Track
│   ├── repository/        # JPA repositories
│   ├── service/           # SpotifyService, YouTubeService, PlaylistService
│   ├── dto/               # PlaylistDTO, TrackDTO
│   └── util/              # JwtUtil
└── src/main/resources/
    └── application.yml
```

### Frontend (based on package.json; exact `/src` structure not fetched)
```
ilovemusic-frontend/
├── package.json           # Vite + React app scripts/deps
└── (typical Vite layout: src/, index.html, vite config, etc.)
```

---

## Setup (Local Development)

### 1) Backend setup

**Prerequisites**
- Java 17+
- PostgreSQL 12+
- Gradle 8+

**Environment variables** (example from backend README)
```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/ilovemusic
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-that-should-be-at-least-256-bits-long-for-HS256

# Spotify OAuth
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube/Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key

# URLs
APP_BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

**Run**
```bash
cd ilovemusic-backend
gradle bootRun
```

Backend runs on:
- `http://localhost:8080`

### 2) Frontend setup

```bash
cd ilovemusic-frontend
npm install
npm run dev
```

Vite typically runs on:
- `http://localhost:5173` (Vite prints the actual URL)

> If your backend expects the frontend at `http://localhost:3000` (as shown in the backend README), either:
> - configure the backend `FRONTEND_URL` to match Vite (5173), or
> - run the frontend on 3000 (requires Vite config), or
> - use a reverse proxy.

---

## Security Model (How it works)

- The backend issues **JWTs** on login.
- Requests to protected playlist endpoints should include `Authorization: Bearer <token>`.
- OAuth provider tokens (Spotify/YouTube) are persisted in the database (see `OAuthToken` entity in backend docs).
- A JWT filter validates access tokens on each request (backend `JwtAuthenticationFilter`).

---

## Testing

### Frontend
```bash
cd ilovemusic-frontend
npm run test
```

### Backend
```bash
cd ilovemusic-backend
gradle test
```

---

## Roadmap / Future Enhancements (from backend docs)

- Full Spotify playlist sync
- Full YouTube API integration for video search
- Better exception handling
- Password hashing/validation improvements
- Email verification
- Playlist sharing
- Unit + integration tests
- Swagger/OpenAPI docs
- Caching + rate limiting

---

## Contributing

1. Fork / clone the repo
2. Create a feature branch
3. Commit with clear messages
4. Push and open a PR

---

## License

MIT (if this repository uses the MIT License).