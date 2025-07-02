import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a separate client for admin operations using service role key
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if no service key

// Admin authentication
export const authenticateAdmin = async (username: string, password: string) => {
  try {
    const { data, error } = await supabase.rpc('authenticate_admin', {
      username_input: username,
      password_input: password
    });

    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }
    
    console.log('Auth response:', data);
    const result = data?.[0];
    
    if (result?.success) {
      // Create a fake session for admin users
      const adminSession = {
        access_token: 'admin-token',
        refresh_token: 'admin-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: result.user_id,
          email: result.email,
          user_metadata: {
            username: result.username,
            full_name: result.full_name,
            role: result.role
          }
        }
      };
      
      // Store admin session in localStorage for admin operations
      localStorage.setItem('admin_session', JSON.stringify(adminSession));
    }
    
    return {
      success: result?.success || false,
      user: result?.success ? {
        id: result.user_id,
        username: result.username,
        email: result.email,
        full_name: result.full_name,
        role: result.role
      } : null
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return { success: false, user: null };
  }
};

// Get admin client for CRUD operations
export const getAdminClient = () => {
  const adminSession = localStorage.getItem('admin_session');
  if (adminSession && supabaseServiceKey) {
    return supabaseAdmin;
  }
  
  // If no service key, use regular client but set auth header
  if (adminSession) {
    const session = JSON.parse(adminSession);
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'X-Admin-User': session.user.id
        }
      }
    });
  }
  
  return supabase;
};

// Database types
export interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  max_participants: number;
  current_participants: number;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  age?: number;
  location?: string;
  business_idea?: string;
  business_stage?: 'idea' | 'startup' | 'existing';
  program_id?: string;
  application_status: 'pending' | 'approved' | 'rejected' | 'waitlist';
  graduation_status: 'enrolled' | 'graduated' | 'dropped_out';
  notes?: string;
  applied_at: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'seminar' | 'networking' | 'graduation' | 'other';
  start_datetime: string;
  end_datetime: string;
  location?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_required: boolean;
  registration_deadline?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  participant_id?: string;
  name: string;
  business_name?: string;
  location?: string;
  quote: string;
  achievement?: string;
  program_completed?: string;
  rating?: number;
  is_featured: boolean;
  is_published: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author_id?: string;
  category: 'news' | 'success_story' | 'program_update' | 'announcement';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  image_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  admin_notes?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
  updated_at: string;
}