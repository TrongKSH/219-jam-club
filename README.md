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

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

App: **http://localhost:4200** (proxies `/api` to the backend).

## Build

- **Backend:** `dotnet build --project backend/VenueApi`
- **Frontend:** `cd frontend && ng build`

## Tech

- **Frontend:** Angular 19, standalone components, SSR (prerender off), HttpClient.
- **Backend:** ASP.NET Core 8, EF Core, SQLite, REST API.
