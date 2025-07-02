import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden professional-spacing">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="relative z-10 professional-container">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-hero font-bold text-foreground mb-8 leading-tight">
            Unlock Your Business Potential with{' '}
            <span className="text-primary">Nepal's Leading</span>{' '}
            Entrepreneurship Program
          </h1>
          <p className="text-body-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 500+ women entrepreneurs who transformed their ideas into thriving businesses.
          </p>
          <Button variant="hero" size="xl" className="group shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" asChild>
            <Link to="/get-involved">
              Start Your Journey Today
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;