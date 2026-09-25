# Nimbus HR — Frontend Redesign

A premium, enterprise-grade UI for your existing HR Management System backend.
**No backend logic, API endpoints, request/response shapes, or authentication
were touched** — this is a frontend-only redesign.

## What's inside

- **Login** — split-screen glassmorphism login with show/hide password,
  remember me, animated validation, loading state.
- **Dashboard** — hero card, 4 live-ish stat cards, employee growth + age
  distribution charts, recent activity feed.
- **Employees** — search, add/edit (glass card, floating labels, two-column
  responsive form, React Hook Form validation), modern data table with
  avatars, status badges, sticky header, pagination, empty state.
- **Analytics / Settings / Profile** — supporting pages, including a working
  dark mode toggle.
- Toast notifications (`react-hot-toast`) instead of `alert()`, a
  confirmation modal for deletes, loading skeletons, and full keyboard
  focus states.

## Talking to your backend

All requests live in `src/api/axios.js` and `src/context/AuthContext.jsx`,
and match exactly what was specified:

| Action | Method & URL |
|---|---|
| Login | `POST /auth/login` — body `{ email, password }` |
| List employees | `GET /users` — query params `search`, `page`, `limit` |
| Create employee | `POST /users` |
| Update employee | `PUT /users/:id` |
| Delete employee | `DELETE /users/:id` |

The JWT is read from `localStorage` and sent as `Authorization: Bearer
<token>` on every request via an axios interceptor — nothing about the auth
flow was changed, only where the token is stored and attached from.

If your backend doesn't run on `http://localhost:5000`, copy `.env.example`
to `.env` and set `VITE_API_BASE_URL`.

**Two spots to double check against your real API,** since the exact
response shape wasn't in the brief:

1. `AuthContext.login()` expects `{ token, user }` back from
   `/auth/login`. If your backend returns different field names (e.g.
   `accessToken`), adjust the two destructured lines there.
2. `Employees.jsx` / `Dashboard.jsx` expect `GET /users` to return either a
   plain array, or an object like `{ data: [...], total }`. Adjust the
   `list = ...` line in each if your shape differs.
3. `EmployeeForm.jsx` assumes fields `name, email, phone, department,
   designation, age, status`. Rename the `register("...")` calls to match
   your actual employee schema.

## Getting started

```bash
npm install
npm run dev
```

The dev server proxies `/auth` and `/users` to `http://localhost:5000` (see
`vite.config.js`), so your Express backend can keep running exactly as-is.

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Stack

React + Vite, Tailwind CSS, Framer Motion, Lucide React, React Hook Form,
React Router, Recharts, react-hot-toast — no Bootstrap.
