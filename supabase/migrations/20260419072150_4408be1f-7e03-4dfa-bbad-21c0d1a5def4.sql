ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'hotel';

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_category_check CHECK (category IN ('hotel', 'vehicle'));

CREATE INDEX IF NOT EXISTS idx_bookings_user_category ON public.bookings(user_id, category);