import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-business.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient opacity-80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-hero font-bold mb-6 leading-tight">
            Unlocking Nepal's Economic Potential Through Women Entrepreneurship
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto font-light leading-relaxed">
            Empowering women entrepreneurs and local businesses to drive inclusive growth, 
            create sustainable employment, and build prosperous communities across Nepal
          </p>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join our mission to transform Nepal into a middle-income country by 2030 through 
            strategic entrepreneurship development and comprehensive business support programs
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button variant="hero" size="xl" className="hover-glow" asChild>
              <Link to="/get-involved">Join Our Mission</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-card/20 text-white border-white/30 hover:bg-white hover:text-primary hover-lift" asChild>
              <Link to="/get-involved">Academy for Women Entrepreneurs</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 hover-lift">
              <div className="text-2xl md:text-3xl font-bold font-display text-accent">500+</div>
              <div className="text-sm opacity-90">Women Empowered</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 hover-lift">
              <div className="text-2xl md:text-3xl font-bold font-display text-accent">150+</div>
              <div className="text-sm opacity-90">Businesses Supported</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 hover-lift">
              <div className="text-2xl md:text-3xl font-bold font-display text-accent">25+</div>
              <div className="text-sm opacity-90">Training Programs</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 hover-lift">
              <div className="text-2xl md:text-3xl font-bold font-display text-accent">85%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;