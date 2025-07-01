import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Award } from 'lucide-react';

const EventsSection = () => {
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

        {/* Featured Event */}
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
                    Registration Open
                  </Badge>
                </div>
                
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-display text-2xl lg:text-h2 font-bold text-foreground">
                    Academy for Women Entrepreneurs (AWE) Bootcamp
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    A comprehensive program designed to help women entrepreneurs scale their businesses. 
                    In Nepal, women-owned businesses contribute extensively to the economy, but face 
                    major challenges including limited access to financing and managerial skills.
                  </p>
                  
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
                        <div className="text-2xl font-bold">500+</div>
                        <div className="text-sm opacity-80">Women Empowered</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Award className="h-8 w-8 text-accent" />
                      <div>
                        <div className="text-2xl font-bold">150+</div>
                        <div className="text-sm opacity-80">Businesses Scaled</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-8 w-8 text-accent" />
                      <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm opacity-80">Week Program</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

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