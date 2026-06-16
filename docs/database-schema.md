# Database Schema

This repository will follow domain-driven schema design with clear ownership per feature module.

## Entity Specification Template
```md
### Entity: <EntityName>
- **Purpose:** <why it exists>
- **Owner Module:** <feature/module>
- **Table/Collection:** <name>
- **Primary Key:** <field/type>
- **Fields:**
  - `<field>`: `<type>` - <description>
- **Indexes:**
  - `<index_name>` on (<columns>)
- **Constraints:**
  - <constraint details>
- **Relations:**
  - <relation description>
- **Lifecycle/Audit Fields:**
  - `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
```

## Schema Governance
- Changes require documented migration strategy.
- Each schema update must include rollback considerations.
- Domain invariants must be enforced both in application logic and DB constraints where applicable.
