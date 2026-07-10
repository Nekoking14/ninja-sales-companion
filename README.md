# NinjaOne Sales Companion

A local desktop app for NinjaOne sales reps — live call dashboard with frameworks, qualification tracking, competitor battlecards, and a built-in call quality score.

---

## What it does

- **Persona selector** — choose the prospect type (Head of IT, IT Manager, CISO etc.) to start a session
- **Sales frameworks** — 9 modules covering call openers, SPIN discovery, AAPA objection handling, battlecards for 8 competitors, buyer personas, value propositions, vulnerability scanning, Cyber Essentials, and qualification
- **Live qualification form** — structured form tracking prospect type (MSP vs Internal IT), cloud/Frankfurt hosting, CRM confirmation, endpoints, implementation time, use case (multi-select), tool stack (multi-select per category), and timeline
- **Call quality score** — live score in the topbar combining qualification completeness (60%) and pain depth from notes (40%)
- **Notes sidebar** — free-text notes auto-saved to the session
- **Sessions view** — all past calls with full qualification summary, notes, call quality score, and one-click copy of a formatted summary
- **Continue call** — resume any past session with all qualification data pre-loaded
- **Edit frameworks** — add or remove items from any framework without touching code
- **Dark / light mode** — toggle in the topbar, persists across restarts
- **Font scale** — A− / A+ controls in any framework panel
- **Auto-updater** — launcher checks GitHub for a newer version on every startup, downloads and installs in the background

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop wrapper | Electron 28 |
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Database | JSON file (no native dependencies) |
| Packaging | electron-builder + GitHub Actions |

---

## Project structure

```
ninja-sales-companion/
├── .github/
│   └── workflows/
│       └── build.yml             Windows installer build + GitHub Release
├── electron/
│   └── main.js                   Electron launcher, server start, auto-updater
├── server/
│   ├── index.js                  Express server (port 3001)
│   ├── jsondb.js                 Pure JS JSON file database
│   └── routes/
│       ├── prospects.js
│       ├── sessions.js
│       ├── report-items.js
│       ├── notes.js
│       └── settings.js
└── client/
    └── src/
        ├── context/
        │   └── AppContext.jsx     Global state (prospect, session, persona, dark mode)
        ├── hooks/
        │   └── useFrameworks.js  Merges defaults with saved customisations
        ├── utils/
        │   └── scoring.js        Call quality scoring logic
        ├── data/
        │   └── frameworks.js     All NinjaOne framework content
        ├── pages/
        │   ├── ProspectSelector.jsx
        │   ├── Dashboard.jsx
        │   ├── ProspectList.jsx
        │   └── EditFrameworks.jsx
        └── components/
            ├── Topbar.jsx
            ├── Sidebar.jsx
            ├── FrameworkPanel.jsx
            ├── FrameworkQuickList.jsx
            ├── QualificationForm.jsx
            ├── RightPanel.jsx
            ├── ToolSelect.jsx
            └── MultiSelect.jsx
```

---

## Local development

**Prerequisites:** Node.js 20 LTS

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start dev server (Express on :3001, React on :5173)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Building a Windows installer

Every push to `main` automatically:

1. Calculates a version from the Git commit count (`1.0.{count}`)
2. Builds the React frontend with Vite
3. Packages with electron-builder
4. Creates a **GitHub Release** tagged `v1.0.{count}` with the `.exe` attached

The installed app checks for updates on every launch and shows a download button if a newer release exists.

**Trigger a build manually:**
GitHub repo → Actions tab → Build Windows Installer → Run workflow

**Download the installer:**
Actions tab → latest successful run → Artifacts → `NinjaOne-Sales-Companion-Windows`

---

## Releasing an update

Just push to `main`. The version increments automatically.

```bash
git add .
git commit -m "describe your change"
git push
```

The new `.exe` appears as a GitHub Release within ~5 minutes. Installed apps will show the update button on next launch.

---

## Data storage

Session data is stored as a JSON file — no external database needed.

- **Windows:** `C:\Users\{name}\AppData\Roaming\NinjaOne Sales Companion\companions.json`
- **Mac (dev):** `~/ninja-sales-companion/data/companions.json`

---

## Call quality scoring

| Component | Weight | How it is measured |
|---|---|---|
| Qualification | 60% | Fields completed: prospect type, cloud status, Frankfurt, endpoints, impl. time, decision maker, CRM checks, timeline, use cases, tool stack |
| Pain depth | 40% | Note length (0–15 pts) + keyword matches from 33 pain indicators (0–20 pts) |

Score bands: **0–40 Weak** · **41–70 Fair** · **71–100 Strong**

---

## API reference

| Method | Path | Description |
|---|---|---|
| GET | /api/prospects | List all sessions |
| POST | /api/prospects | Create prospect |
| GET | /api/prospects/:id | Get with full history |
| PUT | /api/prospects/:id | Update |
| DELETE | /api/prospects/:id | Delete |
| POST | /api/sessions | Start a session |
| GET | /api/sessions/:id | Get with items and notes |
| PUT | /api/sessions/:id/end | End session |
| PUT | /api/sessions/:id/qualification | Save qualification data |
| POST | /api/report-items | Add framework item |
| DELETE | /api/report-items/:id | Remove item |
| POST | /api/notes | Add note |
| DELETE | /api/notes/:id | Remove note |
| GET | /api/settings | List framework customisations |
| PUT | /api/settings/:key | Save customisation |
| DELETE | /api/settings/:key | Delete customisation |
