export type TripCategory = "gunung" | "curug" | "hutan";
export type TripStatus = "draft" | "open" | "full" | "closed" | "completed";
export type DifficultyTier = "Pemula" | "Menengah" | "Lanjutan";

export type Trip = {
  id: string;
  slug: string;
  title: string;
  category: TripCategory;
  location: string;
  province: string | null;
  meeting_point: string | null;
  start_date: string;
  end_date: string | null;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  difficulty_tier: DifficultyTier;
  elevation_m: number | null;
  quota: number;
  seats_taken: number;
  seats_remaining: number;
  price: number;
  summary: string;
  description: string;
  highlights: string[];
  includes: string[];
  requirements: string[];
  image_url: string | null;
  status: TripStatus;
};

export type RegistrationInput = {
  trip_id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  experience_level: string;
  medical_notes: string | null;
  notes: string | null;
};

export type MemberInput = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  birth_date: string | null;
  experience_level: string;
  interests: string[];
  motivation: string;
};

export type ArticleCategory = "perlengkapan" | "etika" | "keselamatan" | "navigasi";

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  read_minutes: number;
  author: string;
  published_at: string;
};
