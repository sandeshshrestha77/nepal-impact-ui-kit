import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Award, Target } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Women Empowered" },
    { icon: TrendingUp, value: "150+", label: "Businesses Launched" },
    { icon: Award, value: "25+", label: "Training Programs" },
    { icon: Target, value: "85%", label: "Success Rate" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.02]"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-8">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-primary">Transforming Nepal's Economy Since 2020</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-responsive-5xl font-bold text-foreground mb-8 leading-tight max-w-5xl mx-auto">
              Unlocking Nepal's Economic Potential Through{' '}
              <span className="text-primary">Women Entrepreneurship</span>
            </h1>

            {/* Subtitle */}
            <p className="text-responsive-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Empowering women entrepreneurs and local businesses to drive inclusive growth, 
              create sustainable employment, and build prosperous communities across Nepal.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button variant="default" size="xl" className="group" asChild>
                <Link to="/get-involved">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white border border-border rounded-xl p-6 text-center shadow-subtle hover:shadow-clean transition-all duration-200 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;