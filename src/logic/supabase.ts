import { createClient } from '@supabase/supabase-js';

// On récupère les variables d'environnement définies dans .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Attention : Les variables Supabase sont manquantes dans .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);