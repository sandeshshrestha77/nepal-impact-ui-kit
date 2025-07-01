import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Target } from 'lucide-react';

const AboutSection = () => {
  const features = [
    "Comprehensive business skills training and mentorship",
    "Access to funding and financial literacy programs", 
    "Market linkage and networking opportunities",
    "Digital literacy and technology adoption"
  ];

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">About Impact Initiative Nepal</span>
              </div>
              <h2 className="text-responsive-4xl font-bold text-foreground mb-6 leading-tight">
                Transforming Nepal's Economic Landscape Through{' '}
                <span className="text-primary">Strategic Empowerment</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-responsive-lg leading-relaxed">
                Impact Initiative Nepal (IIN) is a purpose-driven non-profit organization committed to 
                unlocking Nepal's economic potential through comprehensive entrepreneurship development 
                and strategic community empowerment initiatives.
              </p>
              <p className="text-responsive-base leading-relaxed">
                Founded on the belief that sustainable economic growth comes from empowering local 
                entrepreneurs—particularly women—we work tirelessly to address systemic barriers 
                including limited access to financing, inadequate business support services, and 
                gaps in entrepreneurial skills development.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 my-8 border border-border shadow-subtle">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Our Core Focus Areas:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-responsive-base leading-relaxed text-muted-foreground mb-8">
              Through our flagship Academy for Women Entrepreneurs (AWE) and various community-based 
              initiatives, we're directly contributing to Nepal's goal of becoming a middle-income 
              country by 2030 while ensuring that economic growth is inclusive and sustainable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" className="group" asChild>
                <Link to="/about">
                  Discover Our Story
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/get-involved">Join Our Mission</Link>
              </Button>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className="animate-fade-in">
            <div className="relative">
              {/* Main Card */}
              <Card className="relative overflow-hidden border-0 shadow-clean">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Vision 2030
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Contributing to Nepal's transformation into a middle-income country through 
                      strategic entrepreneurship development and inclusive economic growth.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">500+</div>
                        <div className="text-xs text-muted-foreground">Women Empowered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">85%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Since Badge */}
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-lg shadow-subtle border border-border">
                <div className="text-sm font-semibold text-primary">Since 2020</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;