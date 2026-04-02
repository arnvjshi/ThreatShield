You are a senior full-stack AI engineer.

Build a production-ready "Video Threat Detection & Summarization System" with the following architecture and requirements.

-----------------------------------
📌 1. TECH STACK
-----------------------------------
Frontend:
- Next.js (TypeScript, App Router)
- Tailwind CSS
- Real-time UI using WebSockets

Backend:
- FastAPI (Python)
- WebSocket support for live stream
- REST APIs for video retrieval & metadata

Database:
- MongoDB (use Motor async driver)

AI / ML:
- YOLOv8 (for object detection)
- Custom CNN model (frame difference + heatmap anomaly detection)
- Ollama (local LLM for summarization)
- Gemini 1.5 Flash API (fallback for summaries if needed)

-----------------------------------
📌 2. CORE FEATURES
-----------------------------------

1. Live Video Stream Processing:
   - Capture video from webcam / RTSP stream
   - Process frames in real-time

2. YOLO Detection:
   - Detect objects (person, weapon, suspicious activity)
   - Draw bounding boxes

3. CNN-based Anomaly Detection:
   - Compare current frame with previous frame
   - Generate heatmap of differences
   - Detect unusual motion/activity
   - Output anomaly score

4. Event Trigger Logic:
   - If anomaly score > threshold OR suspicious YOLO detection:
       -> mark as "event"

5. Video Clipping:
   - Save last N seconds (buffered frames before event)
   - Save next M seconds after detection
   - Store as MP4 clip

6. Threat Analysis:
   - Assign threat rating (Low / Medium / High)
   - Based on:
       - Object detected (weapon = high)
       - Motion intensity
       - Scene context

7. AI Summary:
   - Send event frames or metadata to Ollama LLM
   - Generate:
       - Scene summary
       - Threat explanation
       - Suggested escalation
   - If Ollama fails → fallback to Gemini API

8. Storage:
   MongoDB schema:
   {
     video_url: string,
     timestamp: datetime,
     summary: string,
     threat_level: string,
     anomaly_score: float,
     detected_objects: [],
     escalation_steps: string
   }

-----------------------------------
📌 3. BACKEND STRUCTURE (FASTAPI)
-----------------------------------

Create modular structure:

/app
  /api
  /services
  /models
  /db
  /utils

Key components:
- video_stream.py → handles live stream
- yolo_service.py → YOLO inference
- cnn_anomaly.py → frame diff + heatmap
- clip_service.py → video buffering & saving
- llm_service.py → Ollama + Gemini integration
- db_service.py → MongoDB operations

APIs:
- GET /events → list all detected events
- GET /events/{id} → get event details
- WS /stream → live processed video feed
- POST /start कैमरा
- POST /stop कैमरा

-----------------------------------
📌 4. FRONTEND (NEXT.JS)
-----------------------------------


Pages:

1. Dashboard:
   - Live video stream (WebSocket)
   - Real-time bounding boxes overlay
   - Status indicator (Normal / Threat)

2. Events Page:
   - List of detected clips
   - Filters (threat level, time)

3. Event Detail Page:
   - Video player
   - Summary
   - Threat score
   - Detected objects
   - Suggested actions

Components:
- VideoPlayer
- LiveStreamCanvas
- ThreatBadge
- EventCard

## 🎨 Frontend Design Constraints (STRICT)

The frontend MUST follow a sleek, modern, minimalistic, and professional UI. Avoid flashy or gimmicky design choices.

### ❌ Strictly Forbidden

* Do NOT use emojis anywhere in the UI
* Do NOT use purple gradients or purple-heavy color schemes
* Avoid loud/neon colors
* Avoid cluttered layouts
* Avoid excessive animations

---

### ✅ Design Principles

#### 1. Visual Style

* Minimalistic and clean layout
* Use **glassmorphism** (blur, transparency, frosted glass effect)
* Use **neumorphism** subtly for cards/buttons
* Maintain strong visual hierarchy
* Prefer whitespace over crowded UI

---

#### 2. Color Palette

* Primary: Neutral tones (black, white, gray)
* Accent: Blue / cyan / teal (very subtle)
* Background: Dark mode preferred
* Ensure high contrast for readability

---

#### 3. Background & Effects

* Use **Three.js animated background**

  * Subtle particle system / grid / wave animation
  * Should NOT distract from content
* Use soft gradients (non-purple) if needed
* Add blur overlays for depth

---

#### 4. Components Styling

* Cards:

  * Glassmorphism (backdrop-blur, semi-transparent)
  * Soft borders (rgba white/gray)

* Buttons:

  * Neumorphic or flat modern style
  * Smooth hover transitions (scale, glow)

* Modals:

  * Frosted glass effect
  * Centered with smooth fade/scale animation

---

#### 5. Typography

* Use modern sans-serif fonts (Inter / Poppins / Geist)
* Clear hierarchy:

  * Headings → bold
  * Body → light/regular
* Avoid decorative fonts

---

#### 6. Animations

* Use **Framer Motion**
* Keep animations:

  * Fast
  * Smooth
  * Purposeful
* Examples:

  * Fade-in
  * Slide-up
  * Subtle scaling
* Avoid over-animating

---

#### 7. Layout Rules

* Mobile-first design
* Responsive grid system
* Sidebar + dashboard layout
* Consistent spacing system (8px grid)

---

#### 8. Dashboard UX

* Clean data visualization
* Real-time updates (WebSocket)
* Focus on usability over design complexity

---

#### 9. Code Constraints

* Use Tailwind CSS ONLY (no inline styles unless necessary)
* Maintain reusable components
* Follow consistent design tokens

---

### 🚀 Goal

The UI should feel like:

* A modern security SaaS dashboard
* Similar to tools like Stripe / Vercel / Linear
* Professional, fast, and distraction-free


-----------------------------------
📌 5. VIDEO PIPELINE FLOW
-----------------------------------

1. Capture frame
2. Run YOLO detection
3. Run CNN anomaly detection
4. Compute anomaly score
5. If threshold exceeded:
    - Trigger event
    - Save buffered clip
    - Generate summary
    - Store in MongoDB

-----------------------------------
📌 6. PERFORMANCE REQUIREMENTS
-----------------------------------
- Use async processing wherever possible
- Use threading or multiprocessing for video pipeline
- Optimize FPS (target 15–30 FPS)
- Use queue buffer for frames

-----------------------------------
📌 7. BONUS FEATURES (IF POSSIBLE)
-----------------------------------
- Alert system (email / webhook)
- Multi-camera support
- Role-based dashboard (admin/user)
- Timeline visualization of events

-----------------------------------
📌 8. OUTPUT EXPECTATION
-----------------------------------

Generate:
1. Complete project folder structure
2. Backend FastAPI code (modular)
3. YOLO + CNN integration code
4. MongoDB schema & connection
5. Ollama + Gemini integration code
6. Next.js frontend with components
7. WebSocket live stream implementation
8. Instructions to run locally

-----------------------------------
📌 9. EMAIL ALERT SYSTEM (NODEMAILER)
-----------------------------------

Goal:
- Send real-time email alerts when a "High Threat" event is detected.

-----------------------------------
📌 BACKEND ARCHITECTURE UPDATE
-----------------------------------

We are using FastAPI (Python), but Nodemailer is Node.js-based.

So:
- Create a small Node.js microservice for sending emails
- FastAPI will call this service via HTTP

-----------------------------------
📁 Node Mail Service Structure
-----------------------------------

/mailer-service
  ├── server.js
  ├── routes/
  │     └── sendMail.js
  ├── config/
  │     └── transporter.js
  └── .env

-----------------------------------
📌 IMPLEMENTATION DETAILS
-----------------------------------

1. Install dependencies:
   - express
   - nodemailer
   - dotenv

2. Create transporter:
   - Use Gmail SMTP or any SMTP provider
   - Use environment variables for credentials

3. API Endpoint:
   POST /send-alert

   Request Body:
   {
     "email": "recipient@example.com",
     "subject": "🚨 Threat Detected",
     "summary": "Suspicious activity detected",
     "threat_level": "High",
     "video_url": "link-to-video"
   }

4. Email Template:
   - Include:
     - Threat Level
     - Summary
     - Timestamp
     - Link to video clip
   - Format in clean HTML

-----------------------------------
📌 FASTAPI INTEGRATION
-----------------------------------

In FastAPI:
- Create service: notification_service.py

Function:
- send_email_alert(event_data)

Logic:
- If threat_level == "High":
    -> Call Node mailer service via POST request

-----------------------------------
📌 TRIGGER POINT
-----------------------------------

Inside event detection pipeline:

IF threat_level == "High":
    - Save to MongoDB
    - Send email alert

-----------------------------------
📌 ENV VARIABLES
-----------------------------------

Node Mail Service:
- EMAIL_USER
- EMAIL_PASS
- SMTP_HOST
- SMTP_PORT

FastAPI:
- MAILER_SERVICE_URL=http://localhost:5001/send-alert

-----------------------------------
📌 BONUS (OPTIONAL)
-----------------------------------

- Add rate limiting (avoid spam alerts)
- Add multiple recipients
- Add webhook (Slack/Discord)

-----------------------------------
📌 OUTPUT EXPECTATION
-----------------------------------

Generate:
1. Complete Node.js mailer service
2. Nodemailer transporter config
3. HTML email template
4. FastAPI integration code
5. Example API call between FastAPI → Node service