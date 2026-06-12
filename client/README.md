# AI Interview Agent — Client

React frontend for the AI Interview Agent application. It provides a landing page, Google authentication, a multi-step AI mock interview experience with voice interaction, performance analytics, interview history, and Razorpay credit purchases.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | React Router DOM 7 |
| State Management | Redux Toolkit + React Redux |
| HTTP Client | Axios (with credentials/cookies) |
| Authentication | Firebase Auth (Google Sign-In) |
| Payments | Razorpay Checkout (script in `index.html`) |
| Animations | Motion (Framer Motion) |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| Progress UI | react-circular-progressbar |
| Icons | react-icons |

## Features

### Landing Page (`/`)
- Hero section with animated CTAs
- Feature highlights: AI evaluation, resume-based interviews, PDF reports, history
- Interview mode showcase: Technical, HR, confidence detection, credits
- Auth-gated navigation — unauthenticated users see a login modal
- Navbar with credit balance and user menu
- Footer

### Authentication
- Google Sign-In via Firebase `signInWithPopup`
- Sends user name/email to backend (`POST /api/auth/google`)
- JWT stored in HTTP-only cookie by the server
- Session restored on app load via `GET /api/user/current-user`
- Auth available as full page (`/auth`) or modal overlay (`AuthModel`)

### Interview Flow (`/interview`)

Three-step wizard managed in `InterviewPage`:

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `Step1StepUp` | Role, experience, mode selection; optional PDF resume upload & AI analysis |
| 2 | `Step2Interview` | Live AI interview with voice, timer, and answer submission |
| 3 | `Step3InterviewRep` | Performance dashboard with charts and PDF download |

**Step 1 — Setup**
- Enter job role and experience
- Choose interview mode: Technical or HR
- Optionally upload a PDF resume for AI parsing (auto-fills role, experience, projects, skills)
- Starts interview (costs 50 credits on the backend)

**Step 2 — Live Interview**
- AI interviewer intro via Web Speech API (`speechSynthesis`)
- Animated AI avatar video (male/female based on selected voice)
- 5 questions with per-question countdown timers
- Voice input via `webkitSpeechRecognition` (Chrome/Edge)
- Manual text input fallback in textarea
- Submit answers for AI evaluation; feedback spoken aloud
- Auto-submit when timer reaches zero
- Finishes session and fetches final report

**Step 3 — Report**
- Overall score with circular progress indicator
- Skill breakdown: Confidence, Communication, Correctness
- Performance trend area chart (per-question scores)
- Question-by-question feedback cards
- Downloadable PDF report (`AI_Interview_Report.pdf`)

### Interview History (`/history`)
- Lists all past interviews (role, experience, mode, score, status, date)
- Click any entry to view full report at `/report/:id`

### Interview Report (`/report/:id`)
- Standalone report page fetched from backend
- Reuses `Step3InterviewRep` component for display

### Pricing & Credits (`/pricing`)
- Three plans: Free (default), Starter Pack (₹100 / 150 credits), Pro Pack (₹500 / 650 credits)
- Razorpay checkout integration for paid plans
- Payment verification updates Redux user state with new credit balance

### Navbar
- Displays current credit balance
- Credit popup with link to pricing
- User avatar with dropdown: Interview History, Logout
- Prompts login modal when unauthenticated

## Project Structure

```text
client/
├── index.html               # App shell, Razorpay checkout script
├── vite.config.js           # Vite + React + Tailwind plugins
├── eslint.config.js         # ESLint configuration
├── public/
│   └── myicon.png           # Favicon
└── src/
    ├── main.jsx             # React root, Router, Redux Provider
    ├── App.jsx              # Routes, session restore, ServerUrl export
    ├── index.css            # Tailwind import
    ├── utils/
    │   └── firebase.js      # Firebase init, Google auth provider
    ├── redux/
    │   ├── store.js         # Redux store
    │   └── userSlice.js     # User state (userData)
    ├── pages/
    │   ├── Home.jsx         # Landing page
    │   ├── Auth.jsx         # Google login page/modal content
    │   ├── InterviewPage.jsx    # 3-step interview wizard
    │   ├── InterviewHistory.jsx # Past interviews list
    │   ├── InterviewReport.jsx  # Standalone report viewer
    │   └── Pricing.jsx      # Credit purchase plans
    ├── components/
    │   ├── Navbar.jsx       # Top nav, credits, user menu
    │   ├── Footer.jsx       # Landing page footer
    │   ├── AuthModel.jsx    # Login modal overlay
    │   ├── Step1StepUp.jsx  # Interview setup form
    │   ├── Step2Interview.jsx   # Live interview UI
    │   ├── Step3InterviewRep.jsx # Report dashboard
    │   └── Timer.jsx        # Circular countdown timer
    └── assets/
        └── videos/
            ├── male-ai.mp4    # AI avatar (male voice)
            └── female-ai.mp4  # AI avatar (female voice)
```

## Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Home | No (gated actions require login) |
| `/auth` | Auth | No |
| `/interview` | InterviewPage | Implicit (API calls need session) |
| `/history` | InterviewHistory | Yes (cookie) |
| `/pricing` | Pricing | Yes (for payment) |
| `/report/:id` | InterviewReport | Yes (cookie) |

## Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_APIKEY` | Yes | Firebase Web API key for Google authentication |
| `VITE_RAZORPAY_KEY_ID` | Yes | Razorpay public key for checkout (must match server key pair) |

Firebase project config (auth domain, project ID, etc.) is hardcoded in `src/utils/firebase.js`.

## Backend Connection

The API base URL is exported from `App.jsx`:

```js
export const ServerUrl = "http://localhost:8000"
```

All API requests use `withCredentials: true` to send the auth cookie.

> **Note:** The server defaults to port `5000` and CORS is configured for `http://localhost:5173`. Update `ServerUrl` in `App.jsx` to match your running backend port (e.g. `http://localhost:5000`).

## Installation

```bash
cd client
npm install
```

## Running

**Development:**

```bash
npm run dev
```

Runs at `http://localhost:5173` by default (Vite).

**Production build:**

```bash
npm run build
npm run preview
```

**Lint:**

```bash
npm run lint
```

## API Integration

The client communicates with the backend server. Key endpoints used:

| Feature | Method | Endpoint |
|---------|--------|----------|
| Session restore | `GET` | `/api/user/current-user` |
| Google login | `POST` | `/api/auth/google` |
| Logout | `GET` | `/api/auth/logout` |
| Resume upload | `POST` | `/api/interview/resume` |
| Generate questions | `POST` | `/api/interview/generate-questions` |
| Submit answer | `POST` | `/api/interview/submit-answer` |
| Finish interview | `POST` | `/api/interview/finish` |
| Interview history | `GET` | `/api/interview/get-interview` |
| Interview report | `GET` | `/api/interview/report/:id` |
| Create payment order | `POST` | `/api/payment/order` |
| Verify payment | `POST` | `/api/payment/verify` |

See [server/README.md](../server/README.md) for full API documentation.

## State Management

Redux stores a single slice for the authenticated user:

```js
// userSlice initial state
{
  userData: null  // { name, email, credits, ... } or null
}
```

`setUserData` is dispatched on:
- App mount (session restore)
- Google login success
- Interview start (credit deduction)
- Payment verification (credit addition)
- Logout (set to `null`)

## Voice & Speech Features

| API | Usage |
|-----|-------|
| `window.speechSynthesis` | AI interviewer speaks questions, intro, and feedback |
| `window.webkitSpeechRecognition` | Captures candidate voice answers (Chrome/Edge) |

Voice selection prefers female voices (Zira, Samantha) with male fallback (David, Mark). The AI avatar video plays while the interviewer is speaking.

**Browser support:** Speech recognition requires a Chromium-based browser. Text input is always available as a fallback.

## Credit System (UI)

| Action | Credits |
|--------|---------|
| New user default | 100 (from backend) |
| Start interview | −50 |
| Starter Pack purchase | +150 (₹100) |
| Pro Pack purchase | +650 (₹500) |

Credit balance is shown in the Navbar. Insufficient credits block interview creation on the backend.

## Pricing Plans

| Plan | Price | Credits | Notes |
|------|-------|---------|-------|
| Free | ₹0 | 100 | Default plan, no payment |
| Starter Pack | ₹100 | 150 | Razorpay checkout |
| Pro Pack | ₹500 | 650 | Best value badge |

## Dependencies

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `@reduxjs/toolkit`, `react-redux` | Global user state |
| `axios` | HTTP requests with cookies |
| `firebase` | Google authentication |
| `tailwindcss`, `@tailwindcss/vite` | Utility-first CSS |
| `motion` | Page and component animations |
| `recharts` | Performance trend charts |
| `jspdf`, `jspdf-autotable` | PDF report generation |
| `react-circular-progressbar` | Score and timer rings |
| `react-icons` | Icon library |

## Application Flow

```text
User visits Home
      │
      ├── Not logged in → Auth modal → Firebase Google → Backend JWT cookie
      │
      └── Logged in
              │
              ├── Start Interview
              │     ├── Step 1: Setup (+ optional resume)
              │     ├── Step 2: Voice interview (5 questions)
              │     └── Step 3: Report + PDF download
              │
              ├── View History → /report/:id
              │
              └── Buy Credits → Razorpay → Credits updated
```

## Notes

- **Razorpay script** is loaded globally in `index.html` before the app module.
- **Auth modal** auto-closes when `userData` is set after successful login.
- **Interview report** can be viewed immediately after finishing (Step 3) or later from history.
- **Resume upload** accepts PDF only; analysis auto-populates role, experience, projects, and skills.
- **Timer auto-submit** sends the current answer when time runs out and advances to the next question.
- Ensure both the **client** and **server** are running, and `ServerUrl` matches the backend port.

## Author

Ritam Majumdar
