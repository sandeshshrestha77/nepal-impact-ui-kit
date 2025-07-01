import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import womenEntrepreneursImage from '@/assets/women-entrepreneurs.jpg';

const AboutSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative">
              <img 
                src={womenEntrepreneursImage}
                alt="Women entrepreneurs in Nepal working together"
                className="rounded-lg card-shadow w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-lg card-shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold">2030</div>
                  <div className="text-sm font-medium">Vision Goal</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-6">
              About Impact Initiative Nepal
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Impact Initiative Nepal (IIN) is a purpose-driven non-profit organization 
                committed to unlocking Nepal's economic potential and strategically founded 
                to be a transformative force for Nepal's economy.
              </p>
              <p>
                We empower local entrepreneurs to lead the charge toward inclusive growth 
                and national prosperity, supporting the Government of Nepal's vision of 
                transitioning to a middle-income country by 2030.
              </p>
              <p>
                Through our Academy for Women Entrepreneurs (AWE) and various initiatives, 
                we address critical challenges including limited access to financing, 
                lack of managerial skills, and the need for a supportive regulatory environment.
              </p>
            </div>
            
            <div className="mt-8">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/about">Read More About Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;