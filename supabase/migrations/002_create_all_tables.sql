-- Create users table for additional user metadata
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  city VARCHAR(100) DEFAULT 'Kathmandu',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table for user profiles with points and referral tracking
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT DEFAULT 0 NOT NULL,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create taskers table for tasker profiles
CREATE TABLE IF NOT EXISTS public.taskers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  city VARCHAR(100),
  skills VARCHAR(255)[],
  hourly_rate NUMERIC(10, 2) DEFAULT 0,
  rating NUMERIC(2, 1) DEFAULT 0,
  total_tasks INT DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  radius_km INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table for booking records
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tasker_id UUID REFERENCES public.taskers(id) ON DELETE SET NULL,
  service_id VARCHAR(255),
  task_description TEXT,
  address TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  total_amount NUMERIC(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create referral_payouts table for referral tracking
CREATE TABLE IF NOT EXISTS public.referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payments table for payment records
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2),
  method VARCHAR(50),
  commission NUMERIC(10, 2),
  tasker_payout NUMERIC(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for users table
-- ============================================
CREATE POLICY "Users can read own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role bypass"
  ON public.users FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for profiles table
-- ============================================
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role bypass"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for taskers table
-- ============================================
CREATE POLICY "Anyone can read public tasker profiles"
  ON public.taskers FOR SELECT
  USING (true);

CREATE POLICY "Taskers can update own profile"
  ON public.taskers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role bypass"
  ON public.taskers FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for bookings table
-- ============================================
CREATE POLICY "Users can read own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() IN (SELECT user_id FROM public.taskers WHERE id = bookings.tasker_id));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() IN (SELECT user_id FROM public.taskers WHERE id = bookings.tasker_id));

CREATE POLICY "Service role bypass"
  ON public.bookings FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for referral_payouts table
-- ============================================
CREATE POLICY "Users can read own payouts"
  ON public.referral_payouts FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Service role bypass"
  ON public.referral_payouts FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- RLS Policies for payments table
-- ============================================
CREATE POLICY "Users can read related payments"
  ON public.payments FOR SELECT
  USING (auth.uid() IN (
    SELECT customer_id FROM public.bookings WHERE id = booking_id
  ) OR auth.uid() IN (
    SELECT user_id FROM public.taskers WHERE id IN (
      SELECT tasker_id FROM public.bookings WHERE id = booking_id
    )
  ));

CREATE POLICY "Service role bypass"
  ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- Create Indexes for Better Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_taskers_user_id ON public.taskers(user_id);
CREATE INDEX IF NOT EXISTS idx_taskers_city ON public.taskers(city);
CREATE INDEX IF NOT EXISTS idx_taskers_status ON public.taskers(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tasker_id ON public.bookings(tasker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_referrer_id ON public.referral_payouts(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_referee_id ON public.referral_payouts(referee_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ============================================
-- Create Auto-Update Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Attach Triggers to All Tables
-- ============================================
DROP TRIGGER IF EXISTS tr_users_updated_at ON public.users;
CREATE TRIGGER tr_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_taskers_updated_at ON public.taskers;
CREATE TRIGGER tr_taskers_updated_at
  BEFORE UPDATE ON public.taskers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_bookings_updated_at ON public.bookings;
CREATE TRIGGER tr_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_referral_payouts_updated_at ON public.referral_payouts;
CREATE TRIGGER tr_referral_payouts_updated_at
  BEFORE UPDATE ON public.referral_payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_payments_updated_at ON public.payments;
CREATE TRIGGER tr_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
