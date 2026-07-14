# API Contracts

## Conventions

- Base path: `/api/v1`
- JSON bodies
- Errors: `{ "error": { "code", "message", "details?", "traceId?" } }`
- Authenticated requests: `Authorization: Bearer <accessToken>`
- Pagination (list endpoints): `?page=&pageSize=` → `{ items, total, page, pageSize }`

## Auth (public unless noted)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/auth/register` | `{ email, password, displayName? }` |
| POST | `/api/v1/auth/login` | `{ email, password }` → tokens + user |
| POST | `/api/v1/auth/refresh` | `{ refreshToken }` |
| POST | `/api/v1/auth/logout` | Bearer required; optional `{ refreshToken }` |
| GET | `/api/v1/auth/me` | Bearer required |

## Health

- `GET /health` — public `{ status, database }`

## Domain (Bearer required)

| Area | Endpoints |
|------|-----------|
| Organizations | `GET/POST /organizations`, `GET /organizations/:id` |
| Workspaces | `GET/POST /workspaces?organizationId=`, `GET /workspaces/:id` |
| Templates | `GET /templates` |
| Projects | `GET/POST /projects`, `GET/PATCH/DELETE /projects/:id` (see below) |
| Workflow | `GET /projects/:projectId/workflow` |
| Statuses | `POST /projects/:projectId/statuses`, `PATCH/DELETE /statuses/:id`, `PUT …/statuses/reorder` |
| Sections | `GET/POST /projects/:projectId/sections`, `PATCH/DELETE /sections/:id` |
| Tags | `GET/POST /projects/:projectId/tags`, `PATCH/DELETE /tags/:id` |
| Tasks | `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id` |
| Comments | `GET/POST /tasks/:taskId/comments` |
| Search | `GET /search?q=` |

### Projects (Phase 2.1)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/projects` | Query: `workspaceId` (required), `archived` (`true`/`false`), `favorite` (`true`/`false`). Excludes soft-deleted. Boolean strings are parsed correctly (`false` is not coerced to true). |
| POST | `/api/v1/projects` | Body: `{ workspaceId, name, key, description?, templateKey? }`. Applies template (`blank` default). |
| GET | `/api/v1/projects/:id` | Single project |
| PATCH | `/api/v1/projects/:id` | Body fields (all optional): `name`, `description`, `isFavorite`, `isArchived`, `lastViewType` |
| DELETE | `/api/v1/projects/:id` | Soft delete (`deletedAt`) |

`isFavorite` is **project-scoped** (not per-user).

## Demo credentials (seed)

- Email: `admin@smartwork.local`
- Password: `Admin123!`
- Orgs: `demo-org`, `partner-org`
- Workspaces: `demo-workspace`, `marketing-workspace` (demo-org), `partner-workspace` (partner-org)
- Projects: `SWENG`, `MKTG`, `OPS`

## Frontend routes (Phase 2.1)

| Path | Purpose |
|------|---------|
| `/login` | Sign in |
| `/projects` | Project list (active / favorites / archived) |
| `/projects/:projectId` | Work tracking for a project |
