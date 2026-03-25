# NotesFrontend

Small React + Vite frontend for the `NotesMicroservice` API.

## Run locally

### Prerequisites

- Node.js 23+ and `npm`
- A local `NotesMicroservice` backend running on `http://localhost:5000`
- CORS enabled on the backend for `http://localhost:5173`

### Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env`:

```text
VITE_API_BASE_URL=
VITE_API_PROXY_TARGET=http://localhost:5000
```

For normal local development, leave `VITE_API_BASE_URL` blank and let Vite proxy `/api` requests to the backend.

3. Start the dev server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:5173
```

### Steam Deck note

If `npm` is missing on Steam Deck, the safer approach is to use `distrobox` instead of installing Node.js directly on the host OS:

```bash
distrobox-create --name dev --image archlinux:latest
distrobox-enter dev
sudo pacman -Syu nodejs npm git base-devel
```

Then, inside the container, run the frontend:

```bash
cd /home/deck/Documents/GitHub/NotesFrontend
npm install
cp .env.example .env
npm run dev
```

## Docker

The frontend is set up to use same-origin `/api` requests by default, which makes Docker deployment simpler.

1. Build and run both services with Docker Compose:

```bash
docker compose up --build
```

2. Open the frontend:

```text
http://localhost:8080
```

3. The API is exposed at:

```text
http://localhost:1998
```

Notes:

- The compose file builds the frontend from this repo and the API from the sibling `../NotesMicroservice` repo.
- The API container uses SQLite by default and stores its database in a Docker volume.
- The frontend container proxies `/api` requests to the API container, so no browser-side container hostname is needed.

## Features

- Create note
- List notes
- Edit note
- Delete note
- Refresh list manually

## API contract

Create:

```json
{
  "title": "My first note",
  "text": "Example content"
}
```

Update:

```json
{
  "id": 1,
  "title": "Updated title",
  "text": "Updated content",
  "noteVersion": 1
}
```
