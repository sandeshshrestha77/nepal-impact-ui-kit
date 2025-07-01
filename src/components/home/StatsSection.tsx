import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Target, Globe, Heart } from 'lucide-react';

const StatsSection = () => {
  const achievements = [
    {
      icon: Users,
      number: "500+",
      label: "Women Entrepreneurs Trained",
      description: "Comprehensive business training and mentorship programs",
      growth: "+40% this year"
    },
    {
      icon: TrendingUp,
      number: "150+",
      label: "Businesses Successfully Launched",
      description: "From startup to sustainable revenue generation",
      growth: "+65% growth rate"
    },
    {
      icon: Award,
      number: "25+",
      label: "Training Programs Conducted",
      description: "Specialized workshops and bootcamps across Nepal",
      growth: "12 locations"
    },
    {
      icon: Target,
      number: "85%",
      label: "Business Success Rate",
      description: "Businesses still operating after 2 years",
      growth: "Industry leading"
    },
    {
      icon: Globe,
      number: "12",
      label: "Districts Reached",
      description: "Expanding access across rural and urban Nepal",
      growth: "50% rural focus"
    },
    {
      icon: Heart,
      number: "2,500+",
      label: "Lives Directly Impacted",
      description: "Including families and communities",
      growth: "Growing daily"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl lg:text-h1 font-bold mb-4">
            Our Growing Impact Across Nepal
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Since our founding, we've been dedicated to creating measurable, sustainable change 
            in Nepal's entrepreneurial ecosystem. Every number represents real lives transformed 
            and communities strengthened.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <Card 
                key={index} 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-3xl lg:text-4xl font-bold font-display text-accent">
                      {achievement.number}
                    </div>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                      {achievement.growth}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-lg font-bold">
                    {achievement.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm opacity-80 leading-relaxed">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-primary-foreground/5 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-bold mb-3">
              Ready to Join These Success Stories?
            </h3>
            <p className="opacity-90 mb-6">
              Whether you're an aspiring entrepreneur or want to support our mission, 
              there's a place for you in Nepal's economic transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="bg-card/20 text-white border-white/30 hover:bg-white hover:text-primary" asChild>
                <Link to="/get-involved">Start Your Journey</Link>
              </Button>
              <Button variant="cta" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;