# SiteSeeker / WonderGuide / Wonderly / PathExpo

> A travel recommendation web application that helps users discover sightseeing places along a travel route.

## How It Works

1. User enters a **source location**
2. User enters a **destination**
3. User receives:
   - A route displayed on a map
   - Sightseeing attractions marked along the route

---

## 1. Backend Architecture (Python)

**Recommended Framework:** [FastAPI](https://fastapi.tiangolo.com/)

### Recommended Project Structure

```
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── route_api.py
│   │   ├── attractions_api.py
│   │   └── recommendation_api.py
│   │
│   ├── services/
│   │   ├── map_service.py
│   │   ├── attraction_service.py
│   │   └── llm_service.py
│   │
│   ├── models/
│   │   └── schemas.py
│   │
│   ├── database/
│   │   └── db.py
│   │
│   └── utils/
│       └── helpers.py
│
└── requirements.txt
```

### What Each Folder Does

| Folder | Purpose |
|--------|---------|
| `routes/` | API endpoints |
| `services/` | Business logic |
| `models/` | Request/response models |
| `database/` | DB connection |
| `utils/` | Helper functions |

### Key Files

- **`route_api.py`** — Handles `POST /route`
- **`map_service.py`** — Mapbox API requests, route generation, polyline processing
- **`attraction_service.py`** — OpenStreetMap queries, nearby attractions, filtering logic

### Recommended Backend Flow

```
Frontend
    ↓
FastAPI
    ↓
Map API
    ↓
Attractions API
    ↓
LLM Recommendation Service
```

---

## 2. UI Generation With AI

### Recommended Tools

| Priority | Tool |
|----------|------|
| ✅ Best | [v0 by Vercel](https://v0.dev/) |
| Alternative | [Lovable](https://lovable.dev/) |
| Alternative | [Bolt.new](https://bolt.new/) |

### Example Prompt

```
Create a modern travel recommendation website with:
- full screen map
- source and destination inputs
- route visualization
- sightseeing markers
- attraction cards
- responsive mobile design
```

### Important Note

AI tools generate:
- ✅ UI layouts and components
- ✅ React/Tailwind code
- ✅ Styling

You still need to connect:
- APIs
- Backend
- Maps
- Data

---

## 3. Database / External Data Source

**Approach:** Use existing map/location databases — no manual data collection needed.

### Recommended Data Source

**[OpenStreetMap](https://www.openstreetmap.org/)** — accessed via the **Overpass API**

### What Data You Can Get

| Query | Data |
|-------|------|
| `tourism=attraction` | Tourist attractions |
| `tourism=museum` | Museums |
| `historic=castle` | Castles |
| `natural=waterfall` | Waterfalls |
| `leisure=park` | Parks |

### Do You Need to Store the Data?

For MVP: **No.** You query the API live, receive JSON results, and display them on the map.

### Example Workflow

```
User enters source/destination
            ↓
Backend gets route from Mapbox
            ↓
Backend sends Overpass query
            ↓
Overpass returns attractions JSON
            ↓
Frontend displays markers on map
```

### Example Overpass Response

```json
{
  "name": "Niagara Falls",
  "lat": 43.08,
  "lon": -79.07
}
```

---

## 4. Recommended Map System

**[Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)** — provides:
- Routes
- Travel time
- Map directions
- Polyline coordinates

---

## Final Recommended Stack

| Part | Technology |
|------|-----------|
| Backend | FastAPI (Python) |
| Frontend | AI-generated React UI |
| Maps | Mapbox |
| Attractions Data | OpenStreetMap |
| Attractions API | Overpass API |
| Database | PostgreSQL/PostGIS (optional later) |
| Containers | Docker |

---

## Development Roadmap

| Phase | Task |
|-------|------|
| Phase 1 | ✅ Generate frontend UI with AI |
| Phase 2 | ✅ Build FastAPI backend |
| Phase 3 | ✅ Connect Mapbox route API |
| Phase 4 | ✅ Connect Overpass API |
| Phase 5 | ✅ Display attractions on map |
| Phase 6 | ✅ Add AI recommendations via LLMs |

---

## Your Main Tasks as Developer

- Build API endpoints
- Connect external APIs
- Process map data
- Filter attractions
- Display results
- Connect frontend to backend

> **Not** manually collecting attraction data — that's handled by OpenStreetMap/Overpass.