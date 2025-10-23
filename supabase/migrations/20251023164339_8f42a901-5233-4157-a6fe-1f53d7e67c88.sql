-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf_cnpj TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create cameras table
CREATE TABLE public.cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'offline' NOT NULL CHECK (status IN ('online', 'offline', 'maintenance')),
  ip_address TEXT,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on cameras
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

-- Cameras policies
CREATE POLICY "Users can view cameras of their clients"
  ON public.cameras FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cameras.client_id
        AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all cameras"
  ON public.cameras FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage cameras of their clients"
  ON public.cameras FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = cameras.client_id
        AND clients.user_id = auth.uid()
    )
  );

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id UUID REFERENCES public.cameras(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  duration INTEGER,
  file_size BIGINT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Users can view videos of their cameras"
  ON public.videos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cameras
      JOIN public.clients ON cameras.client_id = clients.id
      WHERE cameras.id = videos.camera_id
        AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all videos"
  ON public.videos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create AI detections table
CREATE TABLE public.ai_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  detection_type TEXT NOT NULL,
  confidence DECIMAL(5,2),
  timestamp_in_video INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on ai_detections
ALTER TABLE public.ai_detections ENABLE ROW LEVEL SECURITY;

-- AI detections policies
CREATE POLICY "Users can view detections of their videos"
  ON public.ai_detections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.videos
      JOIN public.cameras ON videos.camera_id = cameras.id
      JOIN public.clients ON cameras.client_id = clients.id
      WHERE videos.id = ai_detections.video_id
        AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all detections"
  ON public.ai_detections FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for cameras updated_at
CREATE TRIGGER update_cameras_updated_at
  BEFORE UPDATE ON public.cameras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, cpf_cnpj, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'cpf_cnpj',
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Assign role based on metadata
  IF NEW.raw_user_meta_data->>'tipo_cliente' = 'admin' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'cliente');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_cameras_client_id ON public.cameras(client_id);
CREATE INDEX idx_cameras_status ON public.cameras(status);
CREATE INDEX idx_videos_camera_id ON public.videos(camera_id);
CREATE INDEX idx_videos_recorded_at ON public.videos(recorded_at DESC);
CREATE INDEX idx_ai_detections_video_id ON public.ai_detections(video_id);