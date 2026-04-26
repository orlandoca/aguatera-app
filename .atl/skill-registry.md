# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When user asks to create a new skill | skill-creator | C:\Users\HP\.gemini\skills\skill-creator\SKILL.md |
| When user says "judgment day" | judgment-day | C:\Users\HP\.gemini\skills\judgment-day\SKILL.md |
| When creating a GitHub issue | issue-creation | C:\Users\HP\.gemini\skills\issue-creation\SKILL.md |
| When creating a pull request | branch-pr | C:\Users\HP\.gemini\skills\branch-pr\SKILL.md |
| When writing Go tests | go-testing | C:\Users\HP\.gemini\skills\go-testing\SKILL.md |
| Use when doing ANY task involving Supabase | supabase | C:\Users\HP\.gemini\extensions\supabase\skills\supabase\SKILL.md |
| Postgres performance optimization | supabase-postgres-best-practices | C:\Users\HP\.gemini\extensions\supabase\skills\supabase-postgres-best-practices\SKILL.md |

## Compact Rules

### aguatera-app-rules
- **Architecture**: No direct Supabase calls in components. All DB logic must go into `src/services/`.
- **UI/UX**: TailwindCSS ONLY. No custom CSS/SCSS unless strictly necessary.
- **React Patterns**: Use functional components with `const`. Use Early Returns for readability.
- **Naming**: Event handlers must prefix with `handle` (e.g., `handleClick`).
- **Standard**: Follow DRY, prioritize readability over premature optimization.
- **Database Context**: Tables are `clientes`, `pagos`, `deudas`, `tarifas`, `historial_cortes`, `usuarios`.
- **Safety**: Never expose `service_role` keys in the frontend.

### react-19
- **Hooks**: Use `use()` for promises/context. No `useMemo`/`useCallback` (React Compiler handle it).
- **Props**: `ref` is a regular prop (no `forwardRef`).
- **Forms**: Use `useActionState` for mutations.

### tailwind-4
- **Engine**: Use native CSS variables and the new simplified engine.
- **Scale**: Leverage improved standard spacing and color scales.

### supabase
- **RLS**: Mandatory on all `public` tables. Verify with `get_advisors`.
- **Update Rule**: `UPDATE` requires a `SELECT` policy to work in RLS.
- **Storage**: Upsert requires `INSERT + SELECT + UPDATE` permissions.
- **Migrations**: Always create via `supabase migration new`. Never invent filenames.
- **Docs**: Always verify features against docs using MCP `search_docs`.

### issue-creation / branch-pr
- **Issue First**: Always create a GitHub issue before starting a PR.
- **Traceability**: PR body must link to the issue ID.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Guía de Proyecto | .agent/rules/guia-de-proyecto.md | Core rules and architecture |
| Supabase Docs | .agent/workflows/docs-supabase.md | Auth and API key reference |
| ESLint Config | eslint.config.js | Linting rules |
| Tailwind Config | tailwind.config.js | Theme and plugins |
| Vite Config | vite.config.js | Build tool configuration |
