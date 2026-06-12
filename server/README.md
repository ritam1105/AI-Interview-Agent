# AI Interview Agent — Server

Node.js/Express backend for the AI Interview Agent application. It handles user authentication, resume parsing, AI-powered interview generation and evaluation, credit-based usage, and Razorpay payments.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose |
| Authentication | JWT (HTTP-only cookies) |
| AI | OpenRouter API (`openai/gpt-4o-mini`) |
| Payments | Razorpay |
| File Upload | Multer (PDF resumes, max 5 MB) |
| PDF Parsing | pdfjs-dist |

## Features

### Authentication
- Google OAuth-style login (name + email from client; no server-side Google SDK)
- JWT stored in an HTTP-only cookie (`token`, 7-day expiry)
- Protected routes via `isAuth` middleware
- Logout clears the auth cookie

### Resume Analysis
- Upload a PDF resume (`multipart/form-data`)
- Extracts text from all pages using `pdfjs-dist`
- Sends resume text to AI and returns structured JSON:
  - `role`, `experience`, `projects`, `skills`
- Uploaded file is deleted after processing

### AI Interview Sessions
- Generates **5 interview questions** tailored to role, experience, mode, projects, skills, and resume
- Difficulty progression: Easy → Easy → Medium → Medium → Hard
- Per-question time limits: 60s, 60s, 90s, 90s, 120s
- Supports **Technical** and **HR** interview modes
- Evaluates each answer on:
  - Confidence (0–10)
  - Communication (0–10)
  - Correctness (0–10)
  - Final score + short human-style feedback
- Handles empty answers and time-limit violations
- Produces a final report with averages and per-question breakdown
- Stores interview history per user

### Credit System
- New users start with **100 credits**
- Starting an interview costs **50 credits**
- Credits can be purchased via Razorpay plans (client-driven)

### Payments (Razorpay)
- Create payment orders in INR
- Verify payment signatures with HMAC-SHA256
- Add purchased credits to the user account on successful verification
- Tracks payment status: `created`, `paid`, `failed`

## Project Structure

```text
server/
├── index.js                 # App entry point, middleware, route mounting
├── config/
│   ├── connectDB.js         # MongoDB connection
│   └── token.js             # JWT generation
├── controller/
│   ├── authController.js    # Google auth, logout
│   ├── userController.js    # Current user profile
│   ├── interviewController.js  # Resume, questions, answers, reports
│   └── paymentController.js # Razorpay order & verification
├── middleware/
│   ├── isAuth.js            # JWT cookie verification
│   └── multer.js            # PDF upload to public/
├── models/
│   ├── userModel.js
│   ├── interviewModel.js
│   └── paymentModel.js
├── routes/
│   ├── authRoute.js
│   ├── userRoutes.js
│   ├── interviewRoute.js
│   └── paymentRoutes.js
├── services/
│   ├── openRouter.js        # OpenRouter AI API client
│   └── razorpay.js          # Razorpay SDK instance
└── public/                  # Temporary PDF upload directory
```

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/ai-interview-agent
JWT_SECRET=your_jwt_secret_here

OPENROUTER_API_KEY=your_openrouter_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing/verifying JWTs |
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter chat completions |
| `RAZORPAY_KEY_ID` | Yes | Razorpay public key (order creation) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret (signature verification) |

## Installation

```bash
cd server
npm install
```

## Running

**Development** (with auto-reload via nodemon):

```bash
npm run dev
```

**Production** (no start script defined — run directly):

```bash
node index.js
```

The server starts at `http://localhost:5000` (or your configured `PORT`) and connects to MongoDB on startup.

### CORS

CORS is configured for the Vite client at `http://localhost:5173` with `credentials: true`. Update `index.js` if your frontend runs on a different origin.

## API Reference

All protected routes require the `token` cookie. The client must send requests with `credentials: true` (or `withCredentials: true` in axios).

Base URL: `http://localhost:5000`

---

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/google` | No | Login or register with Google user info |
| `GET` | `/logout` | No | Clear auth cookie |

**POST `/api/auth/google`**

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Response: `200` — User object. Sets `token` cookie.

---

### User — `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/current-user` | Yes | Get logged-in user profile |

Response: `200` — User object (`name`, `email`, `credits`, etc.)

---

### Interview — `/api/interview`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/resume` | Yes | Upload and analyze PDF resume |
| `POST` | `/generate-questions` | Yes | Create interview session (costs 50 credits) |
| `POST` | `/submit-answer` | Yes | Submit and evaluate an answer |
| `POST` | `/finish` | Yes | Complete interview and get final scores |
| `GET` | `/get-interview` | Yes | List user's past interviews |
| `GET` | `/report/:id` | Yes | Get detailed report for one interview |

**POST `/api/interview/resume`**

- Content-Type: `multipart/form-data`
- Field: `resume` (PDF file, max 5 MB)

Response:
```json
{
  "role": "Software Engineer",
  "experience": "2 years",
  "projects": ["Project A", "Project B"],
  "skills": ["JavaScript", "React"],
  "resumeText": "..."
}
```

**POST `/api/interview/generate-questions`**

Request body:
```json
{
  "role": "Software Engineer",
  "experience": "2 years",
  "mode": "Technical",
  "resumeText": "...",
  "projects": ["Project A"],
  "skills": ["JavaScript"]
}
```

Response:
```json
{
  "interviewId": "...",
  "creditsLeft": 50,
  "userName": "John Doe",
  "questions": [
    {
      "question": "...",
      "difficulty": "Easy",
      "timeLimit": 60
    }
  ]
}
```

**POST `/api/interview/submit-answer`**

Request body:
```json
{
  "interviewId": "...",
  "questionIndex": 0,
  "answer": "My answer here",
  "timeTaken": 45
}
```

Response:
```json
{
  "feedback": "Clear and confident answer with good structure."
}
```

**POST `/api/interview/finish`**

Request body:
```json
{
  "interviewId": "..."
}
```

Response:
```json
{
  "finalScore": 7.2,
  "confidence": 7.0,
  "communication": 8.0,
  "correctness": 6.5,
  "questionWiseScore": [...]
}
```

**GET `/api/interview/get-interview`**

Response: Array of interviews (role, experience, mode, finalScore, status, createdAt).

**GET `/api/interview/report/:id`**

Response: Full interview report with per-question scores and feedback.

---

### Payment — `/api/payment`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/order` | Yes | Create a Razorpay order |
| `POST` | `/verify` | Yes | Verify payment and add credits |

**POST `/api/payment/order`**

Request body:
```json
{
  "planId": "plan_basic",
  "amount": 99,
  "credits": 200
}
```

Response: Razorpay order object (includes `id`, `amount`, `currency`).

**POST `/api/payment/verify`**

Request body:
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```

Response:
```json
{
  "success": true,
  "message": "Payment verified and credits added",
  "user": { "...updated user with new credits..." }
}
```

## Data Models

### User
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `name` | String | — | Required |
| `email` | String | — | Required, unique |
| `credits` | Number | `100` | Deducted per interview |

### Interview
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref: User |
| `role` | String | Target job role |
| `experience` | String | Experience level |
| `mode` | String | `Technical` or `HR` |
| `resumeText` | String | Optional resume context |
| `questions` | Array | Question objects with scores/feedback |
| `finalScore` | Number | Average score after completion |
| `status` | String | `Incomplete` or `Completed` |

### Question (embedded in Interview)
| Field | Type | Notes |
|-------|------|-------|
| `question` | String | Interview question text |
| `difficulty` | String | Easy / Medium / Hard |
| `timeLimit` | Number | Seconds allowed |
| `answer` | String | Candidate's answer |
| `feedback` | String | AI feedback |
| `score` | Number | Final score 0–10 |
| `confidence` | Number | 0–10 |
| `communication` | Number | 0–10 |
| `correctness` | Number | 0–10 |

### Payment
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref: User |
| `planId` | String | Plan identifier |
| `amount` | Number | Amount in INR |
| `credits` | Number | Credits to add on success |
| `razorpayOrderId` | String | Razorpay order ID |
| `razorpayPaymentId` | String | Set after payment |
| `status` | String | `created`, `paid`, `failed` |

## Request Flow

```text
Client (Vite, :5173)
        │
        ▼
   Express Server (:5000)
        │
        ├── /api/auth     → JWT cookie auth
        ├── /api/user     → User profile (protected)
        ├── /api/interview → Resume → Questions → Answers → Report
        └── /api/payment  → Razorpay order → Verify → Credits
        │
        ▼
   MongoDB          OpenRouter AI        Razorpay
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth tokens |
| `cookie-parser` | Read auth cookies |
| `cors` | Cross-origin requests from client |
| `dotenv` | Environment variable loading |
| `axios` | HTTP client for OpenRouter API |
| `multer` | PDF file uploads |
| `pdfjs-dist` | PDF text extraction |
| `razorpay` | Payment gateway SDK |
| `crypto` | HMAC signature verification |
| `nodemon` | Dev auto-reload |

## Notes

- **Auth model**: The server trusts name/email sent from the client after Google sign-in on the frontend (Firebase). There is no server-side Google token verification.
- **Cookie settings**: Cookies use `httpOnly`, `secure`, and `sameSite: "none"` — suitable for cross-origin production deployments over HTTPS.
- **File storage**: Resumes are stored temporarily in `public/` and deleted after analysis.
- **AI model**: All AI calls go through OpenRouter using `openai/gpt-4o-mini`.
- **Credits**: Insufficient credits (< 50) block interview creation.

## Author

Ritam Majumdar
