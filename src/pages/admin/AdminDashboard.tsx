import React, { useEffect, useState } from 'react';
import { getAdminClient, type Program, type Participant, type Testimonial, type ContactSubmission, type NewsletterSubscriber } from '@/lib/supabase';
import { Users, Award, MessageSquare, Mail, UserPlus } from 'lucide-react';
import DashboardStatCard from '@/components/admin/DashboardStatCard';
import DashboardRecentList from '@/components/admin/DashboardRecentList';

const statCards = [
  { label: 'Participants', icon: <Users className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50', key: 'participants' },
  { label: 'Programs', icon: <Award className="w-6 h-6 text-green-500" />, color: 'bg-green-50', key: 'programs' },
  { label: 'Testimonials', icon: <MessageSquare className="w-6 h-6 text-purple-500" />, color: 'bg-purple-50', key: 'testimonials' },
  { label: 'Contacts', icon: <Mail className="w-6 h-6 text-orange-500" />, color: 'bg-orange-50', key: 'contacts' },
  { label: 'Subscribers', icon: <UserPlus className="w-6 h-6 text-pink-500" />, color: 'bg-pink-50', key: 'subscribers' },
];

const AdminDashboard: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getAdminClient();
      const { data: pData } = await supabase.from('programs').select('*');
      const { data: partData } = await supabase.from('participants').select('*');
      const { data: tData } = await supabase.from('testimonials').select('*');
      const { data: cData } = await supabase.from('contact_submissions').select('*');
      const { data: sData } = await supabase.from('newsletter_subscribers').select('*');
      setPrograms(pData || []);
      setParticipants(partData || []);
      setTestimonials(tData || []);
      setContacts(cData || []);
      setSubscribers(sData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl text-primary/60">Loading dashboard...</div>;

  const statData = {
    participants: participants.length,
    programs: programs.length,
    testimonials: testimonials.length,
    contacts: contacts.length,
    subscribers: subscribers.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <DashboardStatCard
            key={card.label}
            icon={card.icon}
            value={statData[card.key]}
            label={card.label}
            color={card.color}
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <DashboardRecentList
          title="Recent Participants"
          items={participants.slice(0, 5).map(p => ({ id: p.id, primary: p.full_name, secondary: p.email }))}
          itemType="participants"
        />
        <DashboardRecentList
          title="Recent Testimonials"
          items={testimonials.slice(0, 5).map(t => ({ id: t.id, primary: t.name, secondary: t.quote.slice(0, 40) + (t.quote.length > 40 ? '...' : '') }))}
          itemType="testimonials"
        />
        <DashboardRecentList
          title="Recent Contacts"
          items={contacts.slice(0, 5).map(c => ({ id: c.id, primary: c.name, secondary: c.email }))}
          itemType="contacts"
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 