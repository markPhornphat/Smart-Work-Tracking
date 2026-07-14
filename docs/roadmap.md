# Roadmap

## Phase 0: Foundation
- [x] Establish AI-first project structure
- [x] Define architecture, standards, and templates
- [x] Add Copilot and Cursor guidance

## Phase 1: Core Domain Discovery
- [x] Thin runnable API slice + monorepo split

## Phase 1.5: Persistence Foundation
- [x] PostgreSQL / Prisma / seed / docs

## Phase 2: Domain API on Prisma + Auth
- [x] pnpm workspaces
- [x] JWT auth (register/login/refresh/me) with Argon2
- [x] Replace in-memory Work Items with Org → Workspace → Project → Task APIs
- [x] Workflow, sections, tags, comments, search REST surface
- [ ] Full RBAC (Roles/Permissions enforcement) — deferred
- [ ] Expand observability beyond structured logs + trace id

## Phase 2.1: Project Management
- [x] Project list (active / favorites / archived)
- [x] Create project (optional template)
- [x] Edit project
- [x] Archive / unarchive project
- [x] Favorite / unfavorite project (project-scoped)
- [x] Soft-delete project
- [x] Workspace switching
- [x] Organization switching
- [x] TanStack Router + Query authenticated shell

## Phase 2.1 UX polish (views + tags + table)
- [x] Technology color palette (color-hex 12616) across the app
- [x] Task **Table** view with user-renamable / show-hide columns
- [x] View switcher: Table / Backlog / Kanban (persists `lastViewType`)
- [x] Tag create / edit / delete + attach tags on tasks
- [x] Sidebar contrast for project key badges and selectors

## Phase 2.2: Workflow Engine
- [ ] Create / duplicate / rename / import / export / delete workflows
- [ ] Reorder statuses; status metadata (name, color, order, category, archived)

## Phase 2.3: Workflow Templates
- [ ] Built-in department templates configuring statuses, sections, tags, views, fields

## Phase 2.4: Backlog
- [x] Section-grouped Backlog view (collapse sections)
- [ ] DnD, infinite scroll, quick add, inline edit, multi-select, bulk actions

## Phase 2.5: Kanban
- [x] Dynamic columns from workflow statuses + move via status select
- [ ] Drag-and-drop; WIP; column collapse/reorder; swimlanes-ready

## Phase 2.6: Task Drawer
- [ ] Full task detail drawer without leaving the page

## Phase 2.7: Custom Fields
- [ ] Project-scoped typed custom fields admin UX

## Phase 2.8: Filtering
- [ ] Multi-field filters with URL + session persistence

## Phase 2.9: Global Search
- [ ] Fuzzy search across projects, tasks, comments, tags, sections

## Phase 3: Enterprise UI polish
- [ ] Command palette, dark mode, keyboard shortcuts, undo delete restore
- [ ] DnD Kit backlog/kanban polish beyond Phase 2.4–2.5

## Phase 4: Scalability and Events
- [ ] Event contracts and async workflows

## Phase 5: Optimization and Governance
- [ ] Performance, security posture, quality KPIs
