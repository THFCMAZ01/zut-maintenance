# ZUT Maintenance Reporter

A full-stack web application for reporting and tracking maintenance issues at Zambia University of Technology (ZUT). Students can submit maintenance reports with photos, and administrators can manage and update the status of all reports.


## Features

- **User Authentication** — Register and login with JWT-based authentication
- **Role-Based Access** — Students submit and track their own reports; Admins manage all reports
- **CRUD Operations** — Create, read, update, and delete maintenance reports
- **File Upload** — Attach photos to reports using Multer
- **Status Tracking** — Reports move through Pending → In Progress → Resolved
- **Comments System** — Both students and admins can comment on reports
- **Dashboard** — Live stats showing total, pending, in-progress and resolved counts
- **Responsive UI** — Clean, accessible interface built with React

---

## Tech Stack

### Frontend
- React.js (Vite)
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs
- Multer (file uploads)

### Database
- PostgreSQL (hosted on Neon)

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Neon

---

## Project Structure
zut-maintenance/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Register and login routes
│   │   ├── reports.js       # CRUD routes for reports
│   │   └── comments.js      # Comment routes
│   ├── uploads/             # Uploaded images stored here
│   ├── db.js                # Database connection
│   ├── seed.js              # Admin account seeder
│   └── server.js            # Express app entry point
│
└── frontend/
└── zut-maintainance/
└── src/
├── components/
│   ├── Navbar.jsx
│   ├── ReportCard.jsx
│   └── StatusBadge.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx
│   ├── NewReportPage.jsx
│   └── ReportDetailPage.jsx
├── api.js
└── App.jsx

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- A Neon PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/your-username/zut-maintenance.git
cd zut-maintenance

## How to setup Backend
cd backend
npm install

## Create a .env file in the backend folder:

PORT=5000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secret_key


## Database scheme used in Neon SQL Editor 

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  image_url VARCHAR(255),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

## Seed the admin account
node seed.js

## Start the backend server
node server.js

## set up for the frontend 
cd frontend/zut-maintainance
npm install
npm run dev
**Open http://localhost:5173 in your browser.

## Default Admin credentials 
Email:    admin@zut.ac.zm
Password: Admin@ZUT2026


API Endpoints
Auth
Method
Endpoint
Description
POST
/api/auth/register
Register a new student
POST
/api/auth/login
Login and receive JWT token
Reports
Method
Endpoint
Description
Access
GET
/api/reports
Get all reports
Admin: all, Student: own
GET
/api/reports/:id
Get single report with comments
Auth
POST
/api/reports
Create a new report
Student
PUT
/api/reports/:id
Update report status
Admin
DELETE
/api/reports/:id
Delete a report
Admin
Comments
Method
Endpoint
Description
Access
POST
/api/reports/:id/comments
Add a comment
Auth




# Assignment Context
This project was developed as the Final Course Project for BSE 3350 — Full-Stack Web Development at Zambia University of Technology (ZUT).
Requirements met:
✅ User Authentication and Login
✅ CRUD Operations
✅ Database Integration using PostgreSQL
✅ API Development using Express.js
✅ File Upload Functionality
✅ Responsive Frontend using React.js
Technologies used: React.js · Express.js · PostgreSQL

# Author
Joshua Mazaza
2410123
BSE Year 3 
GitHub: @THFCMAZ01
