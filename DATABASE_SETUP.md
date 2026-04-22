# KaamSathi Database Setup Guide

## Issue Summary
Your application is trying to access Supabase tables that don't exist yet. The errors shown are:
```
PGRST205 | Could not find the table 'public.profiles' in the schema cache
```

## Solution

### Step 1: Run the Migrations

Execute the SQL migrations to create all necessary database tables:

**Via Supabase Dashboard (Easiest):**

1. Open your [Supabase project dashboard](https://app.supabase.com)
2. Go to **SQL Editor** on the left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Create profiles table for user profiles with points and referral tracking
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT DEFAULT 0 NOT NULL,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: Service role can do anything
CREATE POLICY "Service role bypass"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Create index on referred_by for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();
```

5. Click **Run** or press `Ctrl+Enter`
6. You should see a success message

### Step 2: Verify the Table Creation

1. Go to **Table Editor** in your Supabase dashboard
2. You should now see `profiles` table listed
3. Click on it to verify the columns: `id`, `points`, `referred_by`, `created_at`, `updated_at`

### Step 3: Restart Your Application

After the migration is complete, restart your development server:

```bash
npm run dev
```

## What Was Created

The migration creates:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | User ID (linked to auth.users) |
| `points` | Integer | Referral points balance |
| `referred_by` | UUID | ID of the user who referred them (nullable) |
| `created_at` | Timestamp | Account creation time |
| `updated_at` | Timestamp | Last update time (auto-updated) |

**Security Features:**
- Row Level Security (RLS) enabled
- Users can only read/update their own profile
- Service role has full access for backend operations
- Automatic timestamp updates

## Error Resolution

After running the migration, the following errors should disappear:
- ✅ `profiles read fallback`
- ✅ `profiles upsert fallback`
- ✅ `profiles update fallback`
- ✅ `profiles minimal read fallback`

## Need Help?

If you encounter issues:

1. **Permissions Error** - Make sure you're running this as the Supabase project owner
2. **RLS Issues** - If RLS policies don't apply, go to **Authentication > Policies** and toggle RLS ON for the profiles table
3. **Table Already Exists** - That's fine! The SQL uses `IF NOT EXISTS`, so it won't error

For more info, see `supabase/migrations/README.md`
