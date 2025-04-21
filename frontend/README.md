# Help Desk Web Frontend

A professional, clean web frontend for the Help Desk system built with **Next.js**, **Tailwind CSS**, and **TypeScript**.

---

## Role Matrix

| Feature                     | Admin        | Ticket Owner (User) | All Users   |
|-----------------------------|--------------|---------------------|---------------|
| Login                       | ✅           | ✅                  | ✅            |
| View all tickets            | ✅           | ✅                  | ✅            |
| Create ticket               | ✅           | ✅                  | ✅            |
| Edit ticket info/status     | ✅ (any)     | ✅ (own)            | ❌            |
| Post replies                | ✅           | ✅                  | ✅            |
| Mark ticket as resolved     | ✅ (any)     | ✅ (own)            | ❌            |
| Manage users                | ✅           | ❌                  | ❌            |
| Generate login codes        | ✅           | ❌                  | ❌            |

---

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Set environment variables

Create `.env.local` in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Client

- Generated from `openapi.yaml` using `openapi-typescript-codegen`.
- Located in `src/api/`.
- Provides typed services for Auth and Tickets.

---

## Deployment

- Designed for **Cloudflare Pages** (static export).
- To build for production:

```bash
npm run build
npm run export
```

- Output will be in `out/` directory.

---

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **Axios** (via generated API client)
- **Headless UI** (for accessible components)

---

## Notes

- Extend `openapi.yaml` to add user management endpoints in the future.
- Use header-based JWT auth (`Authorization: Bearer <token>`).
- Tokens stored in localStorage.

## To-Be-Work-On
User Management (Admin only)
List users
Create/edit/delete users
Generate login codes
Authentication Enhancements

Protect routes based on auth state and role
Polish & Responsiveness

Improve mobile layout
Accessibility improvements
Consistent styling across pages
Optional: Notifications, Profile page, etc.
