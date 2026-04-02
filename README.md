# ThreatDetect

Video Threat Detection & Summarization System built with FastAPI, Next.js, MongoDB, YOLOv8, anomaly detection, Ollama/Gemini summarization, and a Nodemailer microservice.

## Key Features

- **Live Video Processing**: Real-time threat detection via YOLOv8 and CNN-based anomaly detection
- **AI Summarization**: Event summaries generated via Ollama or Gemini API
- **User Registration**: Each user registers their email to receive personalized threat alerts
- **Dynamic Email Alerts**: High-threat events are emailed only to the registered user who owns the camera
- **Event Clipping**: Automatic MP4 clip generation with pre/post-event buffering
- **Dashboard**: Glassmorphic web UI with live stream, event list, and event details
- **WebSocket Stream**: Real-time video frames and metadata pushed to connected clients

## Project Structure

```
.
├── backend/                  # FastAPI API with ML pipeline
│   ├── app/
│   │   ├── api/routes/       # REST endpoints
│   │   ├── services/         # YOLO, CNN, LLM, DB, notifications
│   │   ├── schemas/          # Pydantic models
│   │   └── db/               # MongoDB connection
│   └── requirements.txt
├── frontend/                 # Next.js dashboard
│   ├── app/                  # Pages (dashboard, events, register)
│   ├── components/           # Reusable UI components
│   └── lib/                  # API client, types
├── mailer-service/           # Node.js email microservice
│   ├── routes/
│   ├── config/
│   └── package.json
└── docker-compose.yml
```

## Setup & Configuration

### 1. Start MongoDB & MongoDB UI (Docker)

```bash
# Start MongoDB and MongoDB Express UI
docker compose up -d

# MongoDB will be available at: mongodb://localhost:27017
# MongoDB UI will be available at: http://localhost:8081
# Credentials: user=admin, password=admin123
```

### 2. User Registration

Users must first register their email address to receive alerts:

1. Open http://localhost:3000/register
2. Enter email, name, and camera name
3. Registration stores profile in MongoDB
4. User email is automatically saved in browser localStorage

### 3. Environment Configuration

Copy .env.example files and fill in credentials:

**backend/.env:**
```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/threatdetect?authSource=admin
OLLAMA_BASE_URL=http://localhost:11434
GEMINI_API_KEY=your-gemini-key
ALERT_RECIPIENTS=fallback@example.com
ALERT_COOLDOWN_SECONDS=300
MAILER_SERVICE_URL=http://localhost:5001/send-alert
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_BACKEND_HTTP_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000
```

**mailer-service/.env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
PORT=5001
```

### 4. Running Services Locally

**Terminal 1: Start MongoDB & MongoDB UI (from root)**
```bash
docker compose up -d
```

**Terminal 2: Start Backend (from backend directory)**
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Terminal 3: Start Frontend (from frontend directory)**
```bash
npm install
npm run dev
```

**Terminal 4: Start Mailer Service (from mailer-service directory)** *(Optional - only if enabling email alerts)*
```bash
npm install
npm start
```

**Verify everything is running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/health
- MongoDB UI: http://localhost:8081
- Mailer Service: http://localhost:5001/health (if running)

## API Endpoints

### User Management
- `POST /users/register` - Register a new user (email, name, camera_name)
- `GET /users/email/{email}` - Get user profile by email
- `GET /users/{user_id}` - Get user profile by ID
- `GET /users` - List all users

### Camera Control
- `POST /start` - Start camera (requires: source, owner_email)
- `POST /stop` - Stop camera

### Events
- `GET /events` - List all detected events (filter by threat_level)
- `GET /events/{event_id}` - Get event details with video clip and summary
- `WS /stream` - WebSocket for live video feed

## Email Alert Flow

1. User registers their email (stored in MongoDB `users` collection)
2. User starts camera via dashboard (passes owner_email in request)
3. Threat event is detected → summary generated
4. EventCreate includes owner_email field
5. High-threat events trigger email alert:
   ```
   FastAPI notification_service → HTTP POST → Nodemailer → SMTP → User's inbox
   ```
6. Rate limiting (300s default) prevents alert spam for the same user

## Database Schema

**users collection:**
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "name": "John Doe",
  "camera_name": "Camera_1"
}
```

**events collection:**
```json
{
  "_id": ObjectId,
  "video_url": "/storage/clips/clip_xyz.mp4",
  "timestamp": "2024-04-02T10:30:00+00:00",
  "summary": "Person with suspicious object detected near entrance",
  "threat_level": "High",
  "anomaly_score": 0.87,
  "detected_objects": [{"label": "gun", "confidence": 0.92, ...}],
  "escalation_steps": "Immediate review recommended",
  "owner_email": "user@example.com",
  "source_id": "default"
}
```

## Notes

- **MongoDB Authentication**: Uses default credentials (admin/admin123) for local development
- **MongoDB UI**: Mongo Express available at http://localhost:8081 for browsing/managing data
- **Pool Sizing**: MongoDB driver uses defaults; tune based on deployment traffic
- **YOLO Fallback**: If weights unavailable, detections gracefully return empty list
- **LLM Pipeline**: Attempts Ollama first, falls back to Gemini API
- **Email Configuration**: Gmail requires app-specific passwords (not regular password)
- **localStorage**: User email stored client-side for faster start/stop requests
- **Optional**: ALERT_RECIPIENTS config setting acts as fallback if owner_email not provided
- **Docker Scope**: Only MongoDB and MongoDB UI are containerized for simplicity. Backend and frontend run on the local machine.
