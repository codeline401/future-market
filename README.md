# SuperMarket Marketplace

Plateforme marketplace pour supermarchés construite avec React, Node.js et Express.

## Structure du projet

```
.
├── frontend/          # Application React + Vite + Tailwind
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── backend/           # API Node.js + Express
    ├── src/
    ├── server.js
    └── package.json
```

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

L'API sera disponible sur `http://localhost:3000`
