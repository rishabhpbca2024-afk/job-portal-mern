# 💼 JobHub — Full-Stack MERN Job Portal

![Project Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Node Version](https://img.shields.io/badge/Node-%3E%3D18.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-purple?style=for-the-badge)

A modern, production-grade **Full-Stack MERN (MongoDB, Express, React, Node.js)** Job Portal application. Built with Role-Based Access Control (**Job Seekers** & **Recruiters**), interactive file explorer resume uploads, real-time application tracking, and multi-layered cybersecurity safeguards.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
  - [Job Seeker Experience](#1-job-seeker-experience)
  - [Recruiter Experience](#2-recruiter-experience)
  - [Security Architecture](#3-enterprise-grade-security)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Architecture](#-project-architecture)
- [🚀 Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [🛡️ Security Highlights](#️-security-highlights)
- [📤 Pushing to GitHub](#-pushing-to-github)

---

## ✨ Key Features

### 1. Job Seeker Experience
- **Authentication**: Secure JWT-based registration and login with encrypted passwords.
- **Job Discovery**: Search and filter opportunities by keyword, work model (*Remote, Full-Time, Part-Time, Contract, Internship*), location, and experience level.
- **Rich Job Details**: Comprehensive job overview, employer profile, salary benchmarks, and skill tags with overflow-protected link wrapping.
- **Native Resume Upload Dialog**: Interactive modal that triggers the computer's native file explorer / directory picker for uploading `.pdf`, `.doc`, or `.docx` resumes (with drag-and-drop & cloud link fallback).
- **Candidate Application Form**: Clean, balanced application workflow collecting verified contact details, phone number, experience tier, portfolio/LinkedIn, resume, and cover letter.
- **Live Application Tracking**: Personal dashboard to track application stages in real-time (`Applied`, `Shortlisted`, `Interview`, `Rejected`).

### 2. Recruiter Experience
- **Recruiter Dashboard**: High-level metrics showing active jobs, candidate counts, and hiring pipelines.
- **Job Postings Management**: Create, edit, update, or remove job listings with full ownership protection.
- **Applicant Management**:
  - Review all candidate submissions per job posting.
  - View applicant contact details (email, phone number, portfolio links).
  - One-click direct preview / download of candidate resumes with original file names.
  - Live status updater dropdown (`Applied` ➔ `Shortlisted` ➔ `Interview` ➔ `Rejected`).

### 3. Enterprise-Grade Security
- **Dual File Upload Validation**: File extension and MIME type inspection preventing disguised executable payloads.
- **Path-Traversal Protection**: Safe cryptographic random hashing for files stored on disk.
- **XSS & Protocol Injection Defense**: Strict validation rejecting `javascript:`, `data:`, and `vbscript:` URI schemes in portfolio, website, and resume links.
- **Tabnabbing Defense**: `rel="noopener noreferrer"` enforced on all external URLs.
- **DDoS & Brute-Force Rate Limiting**: Global IP-based rate limiting (300 req / 15 min) and strict auth rate limiting (30 attempts / 15 min).
- **HTTP Security Headers**: Configured via `helmet` (MIME sniffing prevention with `nosniff`, clickjacking defense, hidden framework fingerprint).
- **Payload Size Capping**: Request bodies strictly capped at `1MB` to prevent memory exhaustion attacks.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios (with centralized JWT interceptors)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM v8)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Handling**: Multer (Disk storage with MIME verification)
- **Security**: Helmet, Express-Rate-Limit, CORS

---

## 📁 Project Architecture

```
Job_Hub_Project/
├── .gitignore                   # Comprehensive root Git ignore
├── README.md                    # Project documentation
├── backend/                     # Node.js Express REST API
│   ├── config/                  # Database connections
│   │   └── db.js
│   ├── controllers/             # Request handlers
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── jobController.js
│   ├── middleware/              # Auth, roles, security & uploads
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/                  # Mongoose data schemas
│   │   ├── Application.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/                  # Express route definitions
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── uploads/                 # Static uploaded resumes (.gitkeep)
│   ├── utils/                   # Token helpers
│   ├── validators/              # Input validators
│   ├── .env.example             # Backend environment template
│   ├── app.js                   # Express application setup
│   ├── package.json             # Backend dependencies
│   └── server.js                # Server entry point
└── frontend/                    # Vite React Single Page App
    ├── public/                  # Public assets
    ├── src/
    │   ├── components/          # Reusable UI components (Navbar, Badges, etc.)
    │   ├── context/             # Global AuthContext & state
    │   ├── pages/               # Application pages (Home, Jobs, JobDetails, Dashboards)
    │   ├── services/            # Axios API client
    │   ├── App.jsx              # Main routes configuration
    │   ├── main.jsx             # React DOM root
    │   └── index.css            # Tailwind CSS directives
    ├── .env.example             # Frontend environment template
    ├── package.json             # Frontend dependencies
    └── vite.config.js           # Vite build config
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or a free MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example template:
   ```bash
   cp .env.example .env
   # Or on Windows PowerShell:
   Copy-Item .env.example .env
   ```

4. Configure your `.env` values (MongoDB URI, Port, JWT Secret).

5. Start the backend server:
   ```bash
   # Development with auto-reload (Nodemon):
   npm run dev

   # Production start:
   npm start
   ```
   *The backend will run on: `http://localhost:5000`*

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file (optional, defaults to `http://localhost:5000/api`):
   ```bash
   cp .env.example .env
   # Or on Windows PowerShell:
   Copy-Item .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on: `http://localhost:5173`*

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB Connection URI | `mongodb://127.0.0.1:27017/jobportal` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |

### Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (Job Seeker / Recruiter) |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### 💼 Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Get all active job listings (supports query filters) |
| `GET` | `/api/jobs/:id` | Public | Get detailed information for a specific job |
| `POST` | `/api/jobs` | Private (Recruiter) | Post a new job opportunity |
| `PUT` | `/api/jobs/:id` | Private (Recruiter) | Update an existing job (Creator only) |
| `DELETE` | `/api/jobs/:id` | Private (Recruiter) | Delete a job posting and its applications |
| `GET` | `/api/jobs/recruiter/my-jobs` | Private (Recruiter) | Retrieve all jobs posted by the recruiter |

### 📄 Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/apply/:jobId` | Private (Job Seeker) | Submit application with resume upload / link |
| `GET` | `/api/applications/my-applications` | Private (Job Seeker) | View all jobs applied by the candidate |
| `GET` | `/api/applications/job/:jobId` | Private (Recruiter) | View all applicants for a posted job |
| `PUT` | `/api/applications/:id/status` | Private (Recruiter) | Update candidate status (`Applied`, `Shortlisted`, `Interview`, `Rejected`) |

---

## 🛡️ Security Highlights

1. **Zero Secret Leakage**: Real `.env` files and user-uploaded files are strictly ignored in `.gitignore`.
2. **Safe File Handling**: Only authentic documents matching `.pdf`, `.doc`, `.docx` extensions and verifiable MIME types (`application/pdf`, `application/msword`, `application/vnd.openxmlformats...`) are accepted.
3. **Storage Sanitization**: Files saved on the server receive randomized 32-character hexadecimal hashes, eliminating directory traversal (`../`) and remote execution vulnerabilities.
4. **Brute Force Shield**: Authentications are capped at 30 requests per 15-minute window per IP.

---

## 📤 Pushing to GitHub

Follow these steps to push your repository cleanly to GitHub:

1. **Verify Git Status** (ensure no secrets or `.env` files are tracked):
   ```bash
   git status
   ```

2. **Stage your clean project files**:
   ```bash
   git add .
   ```

3. **Commit your changes**:
   ```bash
   git commit -m "feat: complete MERN job portal with resume upload and security hardening"
   ```

4. **Link your GitHub Remote Repository**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   ```

5. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## 📄 License
This project is licensed under the **ISC License**.
