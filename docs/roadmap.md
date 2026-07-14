# Roadmap

## Phase 0: Foundation
- [x] Establish AI-first project structure
- [x] Define architecture, standards, and templates
- [x] Add Copilot and Cursor guidance

## Phase 1: Core Domain Discovery
- [x] Finalize bounded contexts (Work Tracking: Project, WorkItem)
- [x] Define key aggregates and business rules
- [x] Draft initial API contracts and data model
- [x] Thin runnable API slice (Fastify + in-memory Work Items)
- [x] Split monorepo into `backend/` and `frontend/`

## Phase 2: MVP Implementation
- [ ] Persist Project/WorkItem (choose DB via ADR)
- [ ] Project management API
- [ ] Harden authentication/authorization
- [ ] Expand observability beyond structured logs + trace id

## Phase 3: Scalability and Events
- [ ] Introduce event contracts and async workflows
- [ ] Prepare module extraction strategy
- [ ] Validate microservice migration criteria

## Phase 4: Optimization and Governance
- [ ] Performance profiling and remediation
- [ ] Security posture improvements
- [ ] Engineering quality KPIs and automated governance
