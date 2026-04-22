# Database Migrations

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query** 
5. Copy and paste the contents of `001_create_profiles_table.sql`
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

This will apply all pending migrations to your database.

## What This Migration Does

The `001_create_profiles_table.sql` migration creates:

- **profiles** table with:
  - `id` - UUID primary key (linked to auth.users)
  - `points` - User's referral points (default: 0)
  - `referred_by` - UUID of the user who referred them (optional)
  - `created_at` - Timestamp of creation
  - `updated_at` - Timestamp of last update (auto-updated)

- **Row Level Security (RLS)** policies:
  - Users can read their own profile
  - Users can update their own profile
  - Service role has full access

- **Performance indexes** on `referred_by` column
- **Auto-update trigger** for `updated_at` timestamp

## Troubleshooting

If you get an error about the table already existing, it's safe to ignore - the migration uses `IF NOT EXISTS` to handle this gracefully.

If RLS policies don't apply correctly, you may need to enable RLS manually:
1. Go to **Authentication > Policies** in your Supabase dashboard
2. Find the `profiles` table
3. Ensure RLS is toggled ON
