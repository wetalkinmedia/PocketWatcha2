import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Using fallback configuration.');
    // Return a mock client that won't break the app
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        admin: {
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null })
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      })
    } as any;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          age: number;
          salary: number;
          zip_code: string;
          relationship_status: 'single' | 'married' | 'divorced' | 'widowed' | 'in-relationship';
          occupation: string;
          phone_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          age: number;
          salary: number;
          zip_code: string;
          relationship_status: 'single' | 'married' | 'divorced' | 'widowed' | 'in-relationship';
          occupation: string;
          phone_number: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          age?: number;
          salary?: number;
          zip_code?: string;
          relationship_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'in-relationship';
          occupation?: string;
          phone_number?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}