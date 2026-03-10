# Running FlashGuard - Frontend + Backend

## Quick Start

### 1. Start the Backend Server (FastAPI)

Open a terminal and run:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

The backend will start at: http://localhost:8000

### 2. Start the Frontend (React + Vite)

Open a new terminal and run:
```bash
cd Frontend
npm run dev
```

The frontend will start at: http://localhost:5173

## How It Works

- The frontend uses a **proxy** configured in `vite.config.ts` to forward API requests to the backend
- When the frontend calls `/api/predict`, Vite proxies it to `http://localhost:8000/predict`
- The backend has **CORS** enabled to allow requests from the frontend
- The backend uses **in-memory storage** for transactions (data resets when server restarts)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Check transaction for fraud |
| `/dashboard/stats` | GET | Get dashboard statistics |
| `/transactions` | GET | Get transaction history |
| `/health` | GET | Health check |

## Testing the Connection

1. Start both servers as shown above
2. Open http://localhost:5173 in your browser
3. The frontend should now communicate with the backend

## Troubleshooting

- **CORS Error**: Make sure backend is running on port 8000
- **Connection Refused**: Check that both servers are running in separate terminals
- **No Data**: The backend uses in-memory storage, so data resets when you restart the backend server

