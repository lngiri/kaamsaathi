# 🚀 KaamSathi Database Quick Start

## Issue
Your Supabase database is missing required tables. You're seeing errors like:
```
PGRST205 | Could not find the table 'public.profiles' in the schema cache
```

## Quick Fix (2 minutes)

### 1. Copy the SQL
Open [supabase/migrations/002_create_all_tables.sql](supabase/migrations/002_create_all_tables.sql) and copy all the SQL code.

### 2. Paste into Supabase
1. Go to https://app.supabase.com → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste the entire SQL code
5. Click **Run** (or Ctrl+Enter)

### 3. Restart Your App
```bash
npm run dev
```

Done! ✅ All errors should be resolved.

---

## What Gets Created

This creates 6 tables with proper security:

| Table | Purpose |
|-------|---------|
| **users** | User metadata (name, phone, role) |
| **profiles** | User points & referral tracking |
| **taskers** | Tasker profiles & skills |
| **bookings** | Service bookings |
| **referral_payouts** | Referral commission tracking |
| **payments** | Payment records |

All tables include:
- ✅ Automatic timestamps
- ✅ Row Level Security (RLS)
- ✅ Performance indexes
- ✅ Referential integrity

---

## Troubleshooting

**Q: "Permission denied" error?**  
A: Make sure you're logged in as the project owner in Supabase.

**Q: "Already exists" error?**  
A: That's fine! The SQL has `IF NOT EXISTS`, so it won't duplicate.

**Q: Still seeing the same errors after running?**  
A: Try restarting your dev server:
```bash
npm run dev
```

**Q: Want to see what gets created?**  
A: Check the detailed guide in [DATABASE_SETUP.md](DATABASE_SETUP.md)

---

## File Locations

- 📝 SQL Migration: [`supabase/migrations/002_create_all_tables.sql`](supabase/migrations/002_create_all_tables.sql)
- 📖 Detailed Guide: [`DATABASE_SETUP.md`](DATABASE_SETUP.md)
- 📚 Migration README: [`supabase/migrations/README.md`](supabase/migrations/README.md)

Need more help? See DATABASE_SETUP.md for detailed information.
