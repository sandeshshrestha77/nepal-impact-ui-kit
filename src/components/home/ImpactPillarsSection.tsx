import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, HandHeart, Award, CircleDollarSign } from 'lucide-react';

const ImpactPillarsSection = () => {
  const pillars = [
    {
      icon: Briefcase,
      title: "Accelerating Job Creation",
      description: "Creating sustainable employment opportunities through entrepreneurship development and business incubation programs."
    },
    {
      icon: Users,
      title: "Unlocking Women's Economic Potential", 
      description: "Empowering women entrepreneurs with skills, resources, and networks needed to build and scale successful businesses."
    },
    {
      icon: HandHeart,
      title: "Empowering Local Economies",
      description: "Strengthening community-based businesses and fostering local economic resilience through strategic partnerships."
    },
    {
      icon: Award,
      title: "Creating Skilled Workforce & Entrepreneurial Ecosystem",
      description: "Building capacity and creating an environment where innovation and entrepreneurship can thrive across Nepal."
    },
    {
      icon: CircleDollarSign,
      title: "Supporting Sustainable Development Goals",
      description: "Aligning our initiatives with UN SDGs to ensure sustainable and inclusive economic growth for all communities."
    }
  ];

  return (
    <section className="professional-spacing bg-background">
      <div className="professional-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
            Our Impact Pillars
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Five strategic areas where we focus our efforts to create lasting economic transformation in Nepal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <Card 
                key={index} 
                className="card-shadow border-0 hover:scale-105 transition-smooth group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl font-bold text-foreground">
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">
              Ready to Create Impact?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join us in building a stronger, more inclusive economy for Nepal. Every contribution matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactPillarsSection;