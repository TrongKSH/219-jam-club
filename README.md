# 219 Jam Club – Venue Website

Venue landing page and content API based on the [Figma Make design](https://www.figma.com/make/0j59KmJhFWIDHKBtmWXUu2/Venue-website-with-calendar).

## Structure

- **frontend/** – Angular 19 app (SSR). Public venue landing; content loaded from the API.
- **backend/** – ASP.NET Core 8 Web API. Content and events API; SQLite DB with seed data.
- **frontend/assets/** – Static assets (e.g. default logo, favicon).

## Run locally

### 1. Backend (API)

```bash
cd backend
dotnet restore
dotnet run --project VenueApi
```

API: **http://localhost:5000**

- `GET /api/content/landing` – landing content (hero, about, contact, etc.)
- `GET /api/events` – all events
- `GET /api/events/upcoming?count=3` – next N upcoming shows
- `POST /api/auth/login` – admin login (returns JWT)
- `PUT /api/content/{key}` – update content (auth required)
- `POST /api/events`, `PUT /api/events/{id}`, `DELETE /api/events/{id}` – events CRUD (auth required)
- `POST /api/uploads` – image upload (auth required)

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

App: **http://localhost:4200** (proxies `/api` and `/uploads` to the backend).

### 3. Admin

- **URL:** http://localhost:4200/admin (redirects to login if not authenticated)
- **Default login:** `admin` / `admin123` (when `Admin:PasswordHash` is empty in appsettings)
- **Contact** – edit address, phone, email, hours, social links, booking info.
- **Gigs & calendar** – add, edit, delete upcoming events. Upload a poster image from your computer (jpg, png, gif, webp); files are stored in the backend and served at `/uploads/...`.

## Build

- **Backend:** `dotnet build --project backend/VenueApi`
- **Frontend:** `cd frontend && ng build`

## Push to GitHub

The repo is already a git repository with an initial commit. To put it on GitHub:

1. **Create a new repository on GitHub**  
   Go to [github.com/new](https://github.com/new), choose a name (e.g. `219JamClub`), leave “Add a README” unchecked, then Create repository.

2. **Add the remote and push** (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub user and repo name):

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

   If you use SSH:

   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

---

## Tech

- **Frontend:** Angular 19, standalone components, SSR (prerender off), HttpClient.
- **Backend:** ASP.NET Core 8, EF Core, SQLite, REST API.
