import { createClient } from '@supabase/supabase-js'

// These values will come from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase environment variables not found!')
    console.warn(
        'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file',
    )
    console.warn('See SUPABASE_SETUP.md for setup instructions')
}

// Create Supabase client (will be undefined if env vars are missing)
export const supabase =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null

// Database table names
export const TABLES = {
    USERS: 'users',
    MOODS: 'moods',
} as const

// Database types (these will match your Supabase schema)
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    icon: string
                    pin: string
                    color: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    icon: string
                    pin: string
                    color: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    icon?: string
                    pin?: string
                    color?: string
                    is_active?: boolean
                    created_at?: string
                }
            }
            moods: {
                Row: {
                    id: string
                    user_id: string
                    user_name: string
                    user_icon: string
                    user_color: string
                    mood: string
                    intensity: 'low' | 'medium' | 'high'
                    note?: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    user_name: string
                    user_icon: string
                    user_color: string
                    mood: string
                    intensity: 'low' | 'medium' | 'high'
                    note?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    user_name?: string
                    user_icon?: string
                    user_color?: string
                    mood?: string
                    intensity?: 'low' | 'medium' | 'high'
                    note?: string
                    created_at?: string
                }
            }
        }
    }
}
