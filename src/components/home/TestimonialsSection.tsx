import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, Star, ArrowRight } from 'lucide-react';
import { supabase, type Testimonial } from '@/lib/supabase';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  const impactHighlights = [
    {
      metric: "92%",
      description: "Of graduates report increased confidence in business decisions"
    },
    {
      metric: "78%",
      description: "Start new businesses or expand existing ones within 6 months"
    },
    {
      metric: "65%",
      description: "Increase their income by 50% or more within the first year"
    },
    {
      metric: "85%",
      description: "Continue operating successfully after 2 years"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">Success Stories</span>
          <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
            Real Women, Real Impact, Real Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the inspiring entrepreneurs who have transformed their communities and built 
            sustainable businesses through our comprehensive support programs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="card-shadow border-0 h-full hover-lift animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="font-display text-lg font-bold text-foreground">
                      {testimonial.name}
                    </CardTitle>
                    {testimonial.business_name && (
                      <p className="text-primary font-semibold">{testimonial.business_name}</p>
                    )}
                    {testimonial.location && (
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    )}
                    {testimonial.program_completed && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {testimonial.program_completed}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <blockquote className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  {testimonial.achievement && (
                    <Badge className="bg-accent text-accent-foreground">
                      {testimonial.achievement}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactHighlights.map((highlight, index) => (
            <Card 
              key={index} 
              className="text-center card-shadow border-0 hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="text-3xl lg:text-4xl font-bold font-display text-primary mb-2">
                  {highlight.metric}
                </div>
                <p className="text-sm text-muted-foreground leading-tight">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl lg:text-h2 font-bold text-foreground mb-4">
              Ready to Write Your Own Success Story?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our next cohort of ambitious women entrepreneurs and get the skills, 
              network, and support you need to build a thriving business in Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="hover-glow group" asChild>
                <Link to="/get-involved">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift" asChild>
                <Link to="/about">Read More Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;