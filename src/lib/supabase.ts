import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin authentication
export const authenticateAdmin = async (username: string, password: string) => {
  try {
    const { data, error } = await supabase.rpc('authenticate_admin', {
      username_input: username,
      password_input: password
    });

    if (error) throw error;
    
    const result = data?.[0];
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