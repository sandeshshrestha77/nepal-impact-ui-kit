import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { supabase, type Program } from '@/lib/supabase';
import { format } from 'date-fns';

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'upcoming')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading programs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">Our Programs</span>
          <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
            Comprehensive Training & Support Programs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a range of specialized programs designed to meet entrepreneurs at every stage 
            of their journey, from initial idea development to business scaling and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <Card 
              key={program.id} 
              className={`card-shadow border-0 h-full hover-lift animate-fade-in ${
                program.featured ? 'ring-2 ring-primary' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {program.featured && (
                      <Badge className="mb-3 bg-primary text-primary-foreground">
                        🌟 Featured Program
                      </Badge>
                    )}
                    <CardTitle className="font-display text-xl font-bold text-foreground mb-2">
                      {program.title}
                    </CardTitle>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.format}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{program.current_participants}/{program.max_participants} participants</span>
                  </div>
                  {program.start_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Starts: {format(new Date(program.start_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
                
                <div className="pt-4">
                  <Button 
                    variant={program.featured ? "hero" : "outline"} 
                    size="default" 
                    className="w-full hover-lift" 
                    asChild
                  >
                    <Link to="/get-involved">
                      {program.featured ? "Apply Now" : "Learn More"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl lg:text-h2 font-bold text-foreground mb-4">
              Ready to Transform Your Business Idea into Reality?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs who have accelerated their business growth 
              through our comprehensive training programs and ongoing support network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="hover-glow" asChild>
                <Link to="/get-involved">Apply for AWE Program</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift" asChild>
                <Link to="/contact">Schedule a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;