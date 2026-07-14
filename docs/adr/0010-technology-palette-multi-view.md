# ADR-0010: Technology Color Palette + Multi-View Work Board

**Date**: 2026-07-14
**Status**: Accepted

## Context

The authenticated work board needed a clearer visual identity, a tabular task surface with adjustable columns, tag administration, and a way to switch between Table, Backlog, and Kanban without leaving the project page. Sidebar project-key badges were low-contrast on the dark sidebar.

## Decision

- Adopt the **Technology** palette from [color-hex.com/color-palette/12616](https://www.color-hex.com/color-palette/12616): `#d4f0fc`, `#89d6fb`, `#02a9f7`, `#02577a`, `#01303f` as CSS design tokens (sidebar uses `#01303f` / `#02577a`).
- Default project work surface is a **configurable Table** (column label + visibility in `localStorage` per project).
- Expose a **View** control for **Table / Backlog / Kanban**; persist selection with project `lastViewType`.
- Support project **tag CRUD** and attach/detach tags via `PATCH /tasks/:id` with `tagIds`.
- Enrich `GET /tasks` with `status`, `section`, `assignee`, and flattened `tags`.

## Consequences

- Frontend theme variables live in `frontend/src/index.css`.
- Kanban move is status-select based until DnD Kit lands in later backlog/kanban polish.
- Tag chips use ice/deep contrast so they remain readable on dark and light surfaces.
