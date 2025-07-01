import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Award, Target, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Women Empowered", color: "bg-primary" },
    { icon: TrendingUp, value: "150+", label: "Businesses Launched", color: "bg-secondary" },
    { icon: Award, value: "25+", label: "Training Programs", color: "bg-accent" },
    { icon: Target, value: "85%", label: "Success Rate", color: "bg-primary" }
  ];

  const trustIndicators = [
    "Registered Non-Profit Organization",
    "4+ Years of Proven Impact",
    "Government Partnership",
    "International Recognition"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-24 lg:pt-28">
      {/* Subtle Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 mb-8">
              <Star className="w-4 h-4 text-secondary fill-current" />
              <span className="text-sm font-semibold text-secondary">Trusted by 500+ Women Entrepreneurs</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero font-bold text-foreground mb-8 leading-tight max-w-5xl mx-auto">
              Unlock Your Business Potential with{' '}
              <span className="text-primary">Nepal's Leading</span>{' '}
              Entrepreneurship Program
            </h1>

            {/* Subtitle */}
            <p className="text-body-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join 500+ successful women entrepreneurs who transformed their ideas into thriving businesses. 
              Get comprehensive training, mentorship, and funding access in our proven 12-week program.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-muted-foreground">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>{indicator}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button variant="hero" size="xl" className="group shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" asChild>
                <Link to="/get-involved">
                  Start Your Journey Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about">
                  See Success Stories
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground mb-16">
              ⭐⭐⭐⭐⭐ Rated 4.9/5 by program graduates • Featured in Nepal Economic Forum
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto animate-slide-up">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="stat-card group-hover:shadow-xl group-hover:-translate-y-2">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md",
                      stat.color
                    )}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <div className="stat-number">
                      {stat.value}
                    </div>
                    <div className="stat-label">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20 animate-fade-in">
            <div className="cta-section max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Transform Your Business Idea?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join our next cohort starting March 2024. Limited spots available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/get-involved">Apply Now - Free Consultation</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-float"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;