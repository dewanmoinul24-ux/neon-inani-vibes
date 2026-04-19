-- Reservations for experiences (adventure sports + events)
CREATE TABLE public.experience_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_id TEXT NOT NULL,
  experience_title TEXT NOT NULL,
  experience_type TEXT NOT NULL, -- 'event' | 'adventure'
  category TEXT,
  organizer TEXT,
  location TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | rejected | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reservations"
  ON public.experience_reservations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations"
  ON public.experience_reservations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON public.experience_reservations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reservations"
  ON public.experience_reservations
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_experience_reservations_updated_at
  BEFORE UPDATE ON public.experience_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_experience_reservations_user_id
  ON public.experience_reservations (user_id);

CREATE INDEX idx_experience_reservations_status
  ON public.experience_reservations (status);