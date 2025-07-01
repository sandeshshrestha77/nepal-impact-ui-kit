import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import trainingImage from '@/assets/training-session.jpg';

const AboutSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative group">
              <img 
                src={trainingImage}
                alt="Professional training session for women entrepreneurs"
                className="rounded-lg card-shadow w-full h-[400px] lg:h-[500px] object-cover transition-smooth group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-smooth"></div>
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-lg card-shadow hover-lift">
                <div className="text-center">
                  <div className="text-2xl font-bold">2030</div>
                  <div className="text-sm font-medium">Vision Goal</div>
                  <div className="text-xs opacity-80 mt-1">Middle Income</div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                <div className="text-sm font-semibold">Since 2020</div>
              </div>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Impact Initiative Nepal</span>
            </div>
            <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-6">
              Transforming Nepal's Economic Landscape Through Strategic Empowerment
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-lg leading-relaxed">
                Impact Initiative Nepal (IIN) is a purpose-driven non-profit organization committed to 
                unlocking Nepal's economic potential through comprehensive entrepreneurship development 
                and strategic community empowerment initiatives.
              </p>
              <p className="leading-relaxed">
                Founded on the belief that sustainable economic growth comes from empowering local 
                entrepreneurs—particularly women—we work tirelessly to address systemic barriers 
                including limited access to financing, inadequate business support services, and 
                gaps in entrepreneurial skills development.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 my-6">
                <h3 className="font-semibold text-foreground mb-3">Our Core Focus Areas:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Comprehensive business skills training and mentorship
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Access to funding and financial literacy programs
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Market linkage and networking opportunities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Digital literacy and technology adoption
                  </li>
                </ul>
              </div>
              <p className="leading-relaxed">
                Through our flagship Academy for Women Entrepreneurs (AWE) and various community-based 
                initiatives, we're directly contributing to Nepal's goal of becoming a middle-income 
                country by 2030 while ensuring that economic growth is inclusive and sustainable.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="hover-lift" asChild>
                <Link to="/about">Discover Our Full Story</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift" asChild>
                <Link to="/get-involved">Join Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;