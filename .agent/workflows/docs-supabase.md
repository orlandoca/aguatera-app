---
description: docs supabase
---

## 🔐 Rule Agent – Supabase API Key

A **Rule Agent** is a type of API key used to authenticate an application component (agent) and define its access level to Supabase services.

### 🧩 Concept of Agent
- **Agent**: Any component of your app (e.g., frontend, backend, microservice).
- **Rule Agent**: An API key that enforces access rules and interacts with Supabase Auth and RLS.
- API keys identify the **application**, while Supabase Auth identifies the **user**.

### 🔑 API Key Types for Agents

| Type             | Format              | Privileges     | Usage Context                          |
|------------------|---------------------|----------------|----------------------------------------|
| Publishable Key  | `sb_publishable_...`| Low            | Safe for public agents (web, mobile)   |
| Secret Key       | `sb_secret_...`     | Elevated       | Backend agents (servers, Edge Functions) |
| Anon Key         | JWT (long-lived)    | Low            | Legacy public agents                   |
| Service Role Key | JWT (long-lived)    | Elevated       | Legacy backend agents                  |

### 🛡️ Security Notes
- **Publishable/Anon keys**: Used in public environments; rely on RLS for data protection.
- **Secret/Service Role keys**: Full access; bypass RLS. Use only in secure environments.
- Never expose **secret keys** in public code or client-side apps.

### 🔍 Best Practices
- Enable **Row Level Security** on all tables.
- Regularly audit permissions for `anon` and `authenticated` roles.
- Rotate compromised keys via the Supabase dashboard.
- Prefer **publishable/secret keys** over legacy JWT-based keys for better security and flexibility.

📚 [Supabase API Key Documentation](https://supabase.com/docs/guides/api/api-keys)