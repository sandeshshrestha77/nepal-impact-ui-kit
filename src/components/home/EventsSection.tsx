import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award, MapPin, Clock } from 'lucide-react';
import { supabase, type Event } from '@/lib/supabase';
import { format } from 'date-fns';

const EventsSection = () => {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState({
    participantsCount: 0,
    businessesLaunched: 0,
    programsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvent();
    fetchStats();
  }, []);

  const fetchFeaturedEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('featured', true)
        .eq('status', 'upcoming')
        .order('start_datetime', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setFeaturedEvent(data);
    } catch (error) {
      console.error('Error fetching featured event:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      const { count: businessesLaunched } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('graduation_status', 'graduated');

      const { count: programsCount } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true });

      setStats({
        participantsCount: participantsCount || 0,
        businessesLaunched: businessesLaunched || 0,
        programsCount: programsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in our mission to empower women entrepreneurs and build a stronger economy for Nepal
          </p>
        </div>

        {featuredEvent ? (
          /* Featured Event */
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
            <Card className="card-shadow border-0 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Featured Event
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {featuredEvent.registration_required ? 'Registration Open' : 'Open Event'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="font-display text-2xl lg:text-h2 font-bold text-foreground">
                      {featuredEvent.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {featuredEvent.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{format(new Date(featuredEvent.start_datetime), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{format(new Date(featuredEvent.start_datetime), 'h:mm a')}</span>
                      </div>
                      {featuredEvent.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span>{featuredEvent.location}</span>
                        </div>
                      )}
                      {featuredEvent.max_attendees && (
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          <span>{featuredEvent.current_attendees}/{featuredEvent.max_attendees} registered</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="hero" size="lg" asChild>
                        <Link to="/get-involved">Register Now</Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/get-involved">More Information</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
                
                {/* Stats Panel */}
                <div className="bg-primary text-primary-foreground p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-display text-lg font-bold mb-4">Program Impact</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-accent" />
                        <div>
                          <div className="text-2xl font-bold">{stats.participantsCount}+</div>
                          <div className="text-sm opacity-80">Women Empowered</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Award className="h-8 w-8 text-accent" />
                        <div>
                          <div className="text-2xl font-bold">{stats.businessesLaunched}+</div>
                          <div className="text-sm opacity-80">Businesses Scaled</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-accent" />
                        <div>
                          <div className="text-2xl font-bold">{stats.programsCount}+</div>
                          <div className="text-sm opacity-80">Programs Available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* No Featured Event */
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in text-center">
            <Card className="card-shadow border-0 p-8">
              <CardContent>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  No Upcoming Featured Events
                </h3>
                <p className="text-muted-foreground mb-6">
                  Stay tuned for our next exciting event announcement!
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/get-involved">Join Our Newsletter</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Ready to be part of Nepal's economic transformation?
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/get-involved">Join the Movement</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;