# Weather Dashboard — Quick Start

## Run the app (2 steps)

### Step 1 — Start backend (Terminal 1)
```powershell
cd "c:\Users\bauch\OneDrive\Documents\Pinnable\weather app\server"
npm run dev
```
Wait until you see: `Weather API server running on http://localhost:5000`

### Step 2 — Start frontend (Terminal 2)
```powershell
cd "c:\Users\bauch\OneDrive\Documents\Pinnable\weather app\client"
npm run dev
```
Open: **http://localhost:5173**

---

## Your API key

Your key is saved in `server/.env`. The app **works right now** using a free backup weather service (Open-Meteo).

When your OpenWeatherMap key becomes active (can take up to 2 hours after signup), the app will automatically switch to OpenWeatherMap — no changes needed.

To verify your key: https://home.openweathermap.org/api_keys

---

## If port 5000 is busy

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Then restart the backend.

---

## Features

- Search any city worldwide
- 5-day forecast + 24-hour chart
- Temperature / humidity / wind statistics
- Dark & light theme, °C / °F toggle
- Favorites & search history
- Interactive map, wind compass, sun timeline
- AQI, UV index, rain probability
- Auto-refresh every 10 minutes
