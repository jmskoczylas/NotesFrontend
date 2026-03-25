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

2. Copy `.env.example` to `.env` and adjust the API base URL if needed:

```text
VITE_API_BASE_URL=http://localhost:5000
```

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
