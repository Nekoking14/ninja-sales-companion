# NinjaOne Sales Companion

A local desktop app for sales reps — live call dashboard with frameworks, battlecards, AAPA objections, SPIN, and a live report builder.

## Quick start (development)

**Prerequisites:** Node.js 18+ installed on your machine.

### 1. Install all dependencies
```bash
# From the project root
npm run install:all
```

### 2. Start the dev server
```bash
npm run dev
```
This starts:
- Express API on http://localhost:3001
- React app (Vite) on http://localhost:5173

Open http://localhost:5173 in your browser.

### 3. (Optional) Open as Electron desktop app
In a separate terminal, while `npm run dev` is running:
```bash
npm run electron
```

---

## Project structure

```
ninja-sales-companion/
├── electron/main.js        ← Electron desktop wrapper
├── server/
│   ├── index.js            ← Express server (port 3001)
│   ├── database.js         ← SQLite init + schema
│   └── routes/             ← REST API routes
│       ├── prospects.js
│       ├── sessions.js
│       ├── report-items.js
│       └── notes.js
└── client/
    └── src/
        ├── App.jsx          ← Router
        ├── context/         ← Global state (prospect, session)
        ├── api/             ← Fetch helpers
        ├── pages/           ← ProspectSelector, Dashboard, ProspectList
        ├── components/      ← Topbar, Sidebar, FrameworkCard, Modal, LiveReportPanel
        ├── data/            ← All NinjaOne framework content
        └── styles/          ← Global dark theme CSS
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/prospects | List all prospects |
| POST | /api/prospects | Create prospect |
| GET | /api/prospects/:id | Get prospect with full history |
| PUT | /api/prospects/:id | Update prospect |
| DELETE | /api/prospects/:id | Delete prospect |
| POST | /api/sessions | Start a call session |
| GET | /api/sessions/:id | Get session details |
| PUT | /api/sessions/:id/end | End a session |
| POST | /api/report-items | Add item to live report |
| DELETE | /api/report-items/:id | Remove item |
| POST | /api/notes | Add a note |
| DELETE | /api/notes/:id | Remove a note |

## Database

SQLite file stored at `data/companions.db` (created automatically on first run).

4 tables: `prospects`, `sessions`, `report_items`, `notes`

## Build for production

```bash
# Build React app
npm run build

# Package as desktop app (requires electron-builder)
npm run pack
```

Output: `dist/` folder with .exe (Windows) or .dmg (Mac) installer.
