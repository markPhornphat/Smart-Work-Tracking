# API Contracts

API design follows API-first principles.

## Endpoint Specification Template
```md
### <METHOD> /<resource-path>

**Purpose:** <business intent>

**Authentication:** <required | optional | none>
**Authorization:** <policy/role requirement>

**Request**
- Path params: <name:type>
- Query params: <name:type>
- Headers: <required headers>
- Body schema:
  ```json
  {
    "field": "type"
  }
  ```

**Response**
- Success (`<code>`):
  ```json
  {
    "data": {}
  }
  ```
- Error (`<code>`):
  ```json
  {
    "errorCode": "...",
    "message": "..."
  }
  ```

**Validation Rules**
- <rule 1>
- <rule 2>

**Idempotency/Concurrency Notes**
- <if applicable>
```

## API Design Rules
- Use resource-oriented routes.
- Keep request/response schemas version-friendly.
- Use consistent error envelope.
- Document rate limits and pagination where needed.
