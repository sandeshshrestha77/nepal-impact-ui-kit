import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, MessageSquare, TrendingUp, Award, Mail, Eye } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAdmin();
  const [stats, setStats] = useState({
    totalParticipants: 0,
    activePrograms: 0,
    upcomingEvents: 0,
    pendingContacts: 0,
    publishedTestimonials: 0,
    newsletterSubscribers: 0
  });
  const [recentData, setRecentData] = useState({
    participants: [],
    programs: [],
    events: [],
    testimonials: [],
    contacts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [
        participantsResult,
        programsResult,
        eventsResult,
        contactsResult,
        testimonialsResult,
        subscribersResult
      ] = await Promise.all([
        supabase.from('participants').select('id', { count: 'exact' }),
        supabase.from('programs').select('id', { count: 'exact' }).eq('status', 'ongoing'),
        supabase.from('events').select('id', { count: 'exact' }).eq('status', 'upcoming'),
        supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('status', 'new'),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_published', true),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      setStats({
        totalParticipants: participantsResult.count || 0,
        activePrograms: programsResult.count || 0,
        upcomingEvents: eventsResult.count || 0,
        pendingContacts: contactsResult.count || 0,
        publishedTestimonials: testimonialsResult.count || 0,
        newsletterSubscribers: subscribersResult.count || 0
      });

      // Fetch recent data
      const [
        recentParticipants,
        recentPrograms,
        recentEvents,
        recentTestimonials,
        recentContacts
      ] = await Promise.all([
        supabase.from('participants').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('programs').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setRecentData({
        participants: recentParticipants.data || [],
        programs: recentPrograms.data || [],
        events: recentEvents.data || [],
        testimonials: recentTestimonials.data || [],
        contacts: recentContacts.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: 'application' | 'program' | 'event' | 'contact') => {
    const variants = {
      application: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        waitlist: 'bg-blue-100 text-blue-800'
      },
      program: {
        upcoming: 'bg-blue-100 text-blue-800',
        ongoing: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      event: {
        upcoming: 'bg-blue-100 text-blue-800',
        ongoing: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      contact: {
        new: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-green-100 text-green-800',
        archived: 'bg-gray-100 text-gray-800'
      }
    };
    return variants[type][status as keyof typeof variants[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const dashboardCards = [
    {
      title: 'Total Participants',
      value: stats.totalParticipants,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Programs',
      value: stats.activePrograms,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Contacts',
      value: stats.pendingContacts,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Published Testimonials',
      value: stats.publishedTestimonials,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.newsletterSubscribers,
      icon: Mail,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.full_name}</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Recent Participants ({recentData.participants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Business Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.participants.map((participant: any) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.full_name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {participant.business_stage || 'Not specified'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(participant.application_status, 'application')}>
                          {participant.application_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(participant.applied_at), 'MMM dd, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Programs ({recentData.programs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.programs.map((program: any) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell>{program.duration}</TableCell>
                      <TableCell>{program.format}</TableCell>
                      <TableCell>{program.current_participants}/{program.max_participants}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(program.status, 'program')}>
                          {program.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {program.start_date ? format(new Date(program.start_date), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events ({recentData.events.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.events.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.event_type}</Badge>
                      </TableCell>
                      <TableCell>{event.location || 'Online'}</TableCell>
                      <TableCell>{event.current_attendees}/{event.max_attendees || '∞'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(event.status, 'event')}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(event.start_datetime), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Recent Testimonials ({recentData.testimonials.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.testimonials.map((testimonial: any) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell>{testimonial.business_name || '-'}</TableCell>
                      <TableCell>{testimonial.location || '-'}</TableCell>
                      <TableCell>
                        {testimonial.rating ? (
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={testimonial.is_published ? "default" : "secondary"}>
                          {testimonial.is_published ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(testimonial.created_at), 'MMM dd, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Submissions ({recentData.contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.contacts.map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject || 'No subject'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(contact.status, 'contact')}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(contact.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;