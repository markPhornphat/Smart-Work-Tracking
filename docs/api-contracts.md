# API Contracts

## Conventions
- Base path: `/api/v1`
- JSON request/response bodies
- Errors use envelope: `{ "error": { "code", "message", "details?", "traceId?" } }`
- Clients may send `x-trace-id`; server echoes it on errors and generates one when absent

## Endpoints

### Health

- **Method/Path:** `GET /health`
- **Auth:** None
- **Response 200:** `{ "status": "ok" }`

### Create Work Item

- **Method/Path:** `POST /api/v1/work-items`
- **Auth:** None (thin slice)
- **Request:**
  ```json
  { "projectId": "proj_default", "title": "Implement login" }
  ```
- **Response 201:**
  ```json
  {
    "id": "wi_...",
    "projectId": "proj_default",
    "title": "Implement login",
    "status": "todo",
    "createdAt": "2026-07-14T00:00:00.000Z",
    "updatedAt": "2026-07-14T00:00:00.000Z"
  }
  ```
- **Errors:** `400 VALIDATION_ERROR`, `404 NOT_FOUND` (unknown project)

### List Work Items

- **Method/Path:** `GET /api/v1/work-items`
- **Query:** `projectId` (optional)
- **Response 200:** `{ "items": [ /* WorkItem */ ] }`

### Get Work Item

- **Method/Path:** `GET /api/v1/work-items/:id`
- **Response 200:** WorkItem object
- **Errors:** `404 NOT_FOUND`

### Update Work Item Status

- **Method/Path:** `PATCH /api/v1/work-items/:id/status`
- **Request:**
  ```json
  { "status": "in_progress" }
  ```
- **Response 200:** Updated WorkItem
- **Errors:** `400 VALIDATION_ERROR`, `400 DOMAIN_RULE_VIOLATION`, `404 NOT_FOUND`

## Design Rules
- Prefer explicit resource naming
- Keep payloads lean
- Version contracts before breaking changes
