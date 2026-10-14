# Course Catalog (Frontend)

**Student:** Novikov Maxim IT3-2304  
**Course:** Advanced Web Technologies · Lab 5: Frontend and Backend Integration

This project is the Next.js frontend of the Course Catalog application, integrated with the FastAPI backend. It demonstrates Server Components data fetching, Client Component data fetching via SWR, browser CORS requests, form validation against API schema, and preflight inspection.

---

## How to Run Both Projects

Always start the **backend first**, then the **frontend**:

### 1. Start the Backend (`course-catalog-api`)
```bash
cd ../course-catalog-api
# Activate virtual environment
source .venv/bin/activate       # macOS / Linux
# or .venv\Scripts\Activate.ps1 # Windows

# Run FastAPI dev server
fastapi dev main.py
```
The API starts at `http://127.0.0.1:8000`.

### 2. Start the Frontend (`course-catalog`)
```bash
cd ../course-catalog
# Install dependencies
pnpm install # or npm install

# Start Next.js development server
pnpm dev     # or npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables (`.env.local`)

Next.js reads environment variables from `.env.local`. This file is git-ignored (`.env*` in `.gitignore`) so that sensitive secrets and environment-specific endpoints are not leaked into source control.

Create `.env.local` in the root of `course-catalog`:
```env
# Server-side requests (Server Components, Route Handlers)
API_URL=http://localhost:8000

# Client-side requests (browser Client Components with SWR and fetch)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- `API_URL`: Visible only to code running on the Next.js server (e.g. `getCourses()` and `getCourse()` in `lib/courses.ts`).
- `NEXT_PUBLIC_API_URL`: Inlined into client JavaScript bundles at build time for browser execution (e.g. in `LikeButton.tsx`, `EnrollForm.tsx`, and `ElectiveFilter.tsx`).

---

## Decisions

### 1. Why `generateStaticParams` was removed from the course page
`generateStaticParams` pre-renders dynamic routes at build time by querying the API during `next build`. If the backend is offline during build, the entire frontend build crashes (`ECONNREFUSED`). Furthermore, once the course catalog is managed by a real backend API, courses and like counts can change dynamically without rebuilding the frontend; pre-rendered static pages would show stale, frozen data. By removing `generateStaticParams` and using `cache: "no-store"`, `/courses` and `/courses/[id]` become dynamic on-demand routes (`ƒ`), ensuring users always see up-to-date data while keeping the build independent of backend uptime.

### 2. Why the Like button gets by without a preflight while the Enrollment form requires one
The Like button sends a simple `POST` request to `http://localhost:8000/courses/{id}/like` without a request body and without custom headers. Under the W3C CORS specification, a `POST` request with a standard CORS-safelisted content type (or no body) is classified as a **Simple Request** and does not require a preflight check. 

Conversely, the Enrollment form sends a JSON payload (`POST /enrollments`) with the request header `Content-Type: application/json`. Since `application/json` is not among the CORS-safelisted content types (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`), the browser must first send a preflight `OPTIONS` request to verify whether the server allows `POST` requests with a `Content-Type` header from `http://localhost:3000`. The server approves it with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, and `Access-Control-Max-Age: 600`.

---

## Breakage Journal

The following controlled breakages were executed and analyzed using the 5-step CORS diagnostic algorithm:

### Breakage 1: Remove CORS entirely
- **What I did:** Commented out the `app.add_middleware(CORSMiddleware, ...)` block in `main.py`.
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Network:**
  - `/filter`: `GET courses` marked red (`(failed) net::ERR_FAILED` / CORS error), while backend terminal logged `200 OK`.
  - Like button: `POST .../like` marked red with CORS error, though backend terminal logged `200 OK` and server like counter incremented.
  - Enrollment form: `OPTIONS enrollments` failed with status `405 Method Not Allowed`; `POST enrollments` was blocked and never sent.
  - `/courses` (Server Component): Worked normally with status `200 OK`.
- **Cause:** No CORS middleware was configured on FastAPI, so response headers lacked `Access-Control-Allow-Origin`, causing the browser to block JavaScript from reading responses. Server components were unaffected because server-to-server requests bypass the browser SOP.
- **How I found it:** Algorithm Step 3 (Response Headers lacked `Access-Control-Allow-Origin`) and Step 4 (Preflight OPTIONS returned 405 Method Not Allowed).

---

### Breakage 2: A trailing slash in `allow_origins`
- **What I did:** Changed `allow_origins=["http://localhost:3000"]` to `allow_origins=["http://localhost:3000/"]`.
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.` and for the form: `Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Network:**
  - `/filter`: `GET courses` failed with CORS error.
  - Like button: `POST .../like` failed with CORS error.
  - Enrollment form: `OPTIONS enrollments` returned status `400 Bad Request` with response body `Disallowed CORS origin`. `POST` was never sent.
- **Cause:** Origins in CORS consist of `<scheme>://<host>:<port>` with no path and strictly no trailing slash. `"http://localhost:3000/"` does not match the browser's origin `"http://localhost:3000"`.
- **How I found it:** Algorithm Step 3 (No `Access-Control-Allow-Origin`) and Step 4 (OPTIONS returned 400 Bad Request with body `Disallowed CORS origin`).

---

### Breakage 3: Remove `allow_methods`
- **What I did:** Removed `allow_methods` or left default (only `GET` allowed).
- **Console:** On form submission: `Response to preflight request doesn't pass access control check: It does not have HTTP ok status.`
- **Network:**
  - `/filter`: `GET courses` worked with status `200 OK`.
  - Like button: `POST .../like` worked with status `200 OK` (simple request, no preflight needed).
  - Enrollment form: `OPTIONS enrollments` returned status `400 Bad Request` with body `Disallowed CORS method`. Response headers included `access-control-allow-origin: http://localhost:3000` and `access-control-allow-methods: GET`. `POST enrollments` was not sent.
- **Cause:** Starlette's `CORSMiddleware` defaults to allowing only `GET` when `allow_methods` is omitted. The preflight check for `POST` was rejected by the server with 400.
- **How I found it:** Algorithm Step 4 (OPTIONS returned 400 Bad Request with body `Disallowed CORS method` and `access-control-allow-methods: GET`).

---

### Breakage 4: A different origin (`http://127.0.0.1:3000`)
- **What I did:** Opened the application at `http://127.0.0.1:3000/filter` with `allowedDevOrigins: ["127.0.0.1"]` in `next.config.ts`.
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Network:** `GET courses` request marked red with CORS error; backend terminal printed `INFO: 127.0.0.1 - "GET /courses HTTP/1.1" 200 OK`.
- **Cause:** Browsers consider `localhost` and `127.0.0.1` as entirely distinct origins. The backend whitelist only contained `http://localhost:3000`.
- **How I found it:** Algorithm Step 3 (`Access-Control-Allow-Origin` was missing for origin `http://127.0.0.1:3000`).

---

### Breakage 5: Python 500 error masquerading as CORS
- **What I did:** Introduced a typo in `main.py` in `list_courses`: changed `p["offset"]` to `p["ofset"]`.
- **Console:** `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Network:**
  - `/filter`: `GET courses` marked red with CORS error.
  - `/courses`: Rendered Next.js `error.tsx` boundary.
  - Like button and enrollment form: Worked normally because their routes were untouched.
- **Backend Terminal:** Status `500 Internal Server Error` with traceback:
  ```
  ERROR:    Exception in ASGI application
  Traceback (most recent call last):
    ...
    File ".../main.py", line 42, in list_courses
      return courses[p["ofset"] : p["offset"] + p["limit"]]
  KeyError: 'ofset'
  ```
- **Cause:** An unhandled Python exception generated a 500 response from an outer ASGI error layer before `CORSMiddleware` could attach `Access-Control-Allow-Origin` headers. The browser masked the 500 error as a CORS error.
- **How I found it:** Algorithm Step 2 and Step 5: Inspected the backend terminal to find `KeyError: 'ofset'` and status `500 Internal Server Error`.

---

## Bonus Tasks Implemented

### Bonus 1: Next.js Rewrites instead of CORS
- Added `rewrites` configuration to `next.config.ts`:
  ```ts
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  }
  ```
- Requests made to `/api/courses` are proxied internally by the Next.js server to FastAPI, eliminating CORS from the browser's perspective.

### Bonus 2: Automated TypeScript types from OpenAPI
- Generated `lib/schema.d.ts` using `openapi-typescript`:
  ```bash
  pnpm exec openapi-typescript http://127.0.0.1:8000/openapi.json -o lib/schema.d.ts
  ```
- Updated `lib/courses.ts` to export:
  ```ts
  export type Course = components["schemas"]["Course"];
  export type Enrollment = components["schemas"]["Enrollment"];
  ```

### Bonus 3: CORS origins from environment variable
- In `course-catalog-api/main.py`:
  ```python
  cors_origins = [
      origin.strip()
      for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
      if origin.strip()
  ]
  ```
- Allows specifying multiple origins via `CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"`.

### Bonus 4: Frozen Data Investigation
- When `cache: "no-store"` is temporarily omitted from `getCourses()`, Next.js statically pre-renders `/courses` at build time (marked `○`). Any changes to like counts or courses in the backend will not appear on `/courses` without rebuilding.
- Dynamic route `/courses/[id]` remains `ƒ` (server-rendered on demand) even without `cache: "no-store"` because it evaluates the dynamic segment parameter `params.id`.

### Bonus 5: Explicit Whitelists for Methods and Headers
- Configured explicit lists:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=cors_origins,
      allow_methods=["GET", "POST"],
      allow_headers=["Content-Type"],
  )
  ```
- **Security Rationale:** An explicit whitelist enforces the principle of least privilege, preventing malicious third-party origins from sending unauthorized HTTP methods (such as `DELETE`, `PUT`, `PATCH`) or exfiltrating sensitive request headers (such as `Authorization`).
