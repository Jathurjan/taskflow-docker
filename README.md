# TaskFlow: MERN Task Management App

A full-stack task manager with two completely separate applications:

| Folder | What it is | Stack |
| --- | --- | --- |
| `backend/` | REST API | Node.js, Express, MongoDB (Mongoose), JWT, bcrypt |
| `frontend/` | Web client | React, Vite, Tailwind CSS, React Router, Axios |

## Features

- Register, log in, log out, JWT authentication, bcrypt password hashing, protected routes
- Dashboard with total, pending, in-progress and completed counts, plus recent tasks
- Create, view, edit, delete tasks; mark complete or reopen
- Priority (Low, Medium, High), status (Pending, In Progress, Completed), due date
- Search, status and priority filters, sorting, pagination, card and table views
- Responsive layout with sidebar, navbar and profile menu

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a free MongoDB Atlas connection string

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start it:

```bash
npm run dev      # auto-restart with nodemon
# or
npm start
```

Check it works: open http://localhost:5000/api/health

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run dev
```

`.env` contains:

```
VITE_API_URL=http://localhost:5000/api
```

Open http://localhost:5173, create an account, and start adding tasks.

To build for production: `npm run build` (output in `frontend/dist`).

## Environment variables

**Backend (`backend/.env`)**

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on |
| `NODE_ENV` | `development` shows error stacks for 500 errors |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens (keep private, use a long random value) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma separated |

**Frontend (`frontend/.env`)**

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API, including `/api` |

Vite reads `VITE_*` variables when the dev server or build starts, so restart after changing them.

## API reference

All task routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account, returns token and user |
| POST | `/api/auth/login` | Log in, returns token and user |
| POST | `/api/auth/logout` | Log out (client discards the token) |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | List tasks. Query: `search`, `status`, `priority`, `sort` (newest, oldest, title), `page`, `limit` |
| GET | `/api/tasks/stats` | Counts and 5 most recent tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Change status only (mark complete or reopen) |
| DELETE | `/api/tasks/:id` | Delete task |

Task body:

```json
{
  "title": "Finish report",
  "description": "Optional details",
  "status": "Pending",
  "priority": "Medium",
  "dueDate": "2026-11-15"
}
```

## Project structure

```
backend/
  server.js                 app entry, CORS, routes
  src/
    config/db.js            Mongoose connection
    models/                 User.js, Task.js
    controllers/            authController.js, taskController.js
    routes/                 authRoutes.js, taskRoutes.js (with validation rules)
    middleware/             auth.js (JWT), validate.js, errorHandler.js
    utils/                  ApiError, asyncHandler, generateToken

frontend/
  index.html
  vite.config.js
  src/
    main.jsx, App.jsx       entry and routes
    services/               api.js (Axios instance), authService.js, taskService.js
    context/AuthContext.jsx session state
    components/             Layout, Sidebar, Navbar, TaskCard, TaskTable, TaskModal, ...
    pages/                  Login, Register, Dashboard, Tasks, NotFound
    hooks/, utils/
```

## Notes

- Passwords are hashed with `bcryptjs` (a pure JavaScript bcrypt implementation, so it installs without native build tools). It is a drop-in for `bcrypt`.
- Logout removes the token on the client. JWTs are stateless, so the API logout route just confirms the request.
- Each user can only see and change their own tasks.
- The frontend stores the token in `localStorage`. This keeps the project simple; for a production app consider httpOnly cookies.

## Troubleshooting

- **CORS error in the browser:** `CLIENT_URL` in `backend/.env` must exactly match the frontend origin (including port). Restart the backend after editing.
- **"Cannot reach the server":** the backend is not running, or `VITE_API_URL` is wrong.
- **MongoDB connection failed:** check that MongoDB is running and `MONGODB_URI` is correct.
