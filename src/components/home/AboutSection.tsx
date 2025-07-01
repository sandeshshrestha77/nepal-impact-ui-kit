import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Target, Users, TrendingUp, Award } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "1-on-1 guidance from successful entrepreneurs and industry experts"
    },
    {
      icon: TrendingUp,
      title: "Funding Access", 
      description: "Direct connections to investors, grants, and microfinance opportunities"
    },
    {
      icon: Award,
      title: "Proven Curriculum",
      description: "12-week comprehensive program with 85% graduate success rate"
    }
  ];

  const outcomes = [
    "Business plan development & validation",
    "Financial literacy & funding strategies", 
    "Digital marketing & online presence",
    "Legal compliance & business registration",
    "Networking with 500+ alumni",
    "Ongoing support & mentorship"
  ];

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="section-badge mb-6">
                Why Choose Impact Initiative Nepal
              </div>
              <h2 className="text-display font-bold text-foreground mb-6 leading-tight">
                From Idea to{' '}
                <span className="text-primary">Thriving Business</span>{' '}
                in Just 12 Weeks
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground mb-8">
              <p className="text-lg leading-relaxed">
                We're not just another training program. We're Nepal's most successful women entrepreneurship 
                initiative with a proven track record of transforming ideas into profitable businesses.
              </p>
              <p className="text-base leading-relaxed">
                Our comprehensive approach combines world-class training, expert mentorship, and direct 
                access to funding opportunities - everything you need to succeed as an entrepreneur in Nepal's 
                growing economy.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" className="group" asChild>
                <Link to="/get-involved">
                  Apply for Next Cohort
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">View Success Stories</Link>
              </Button>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className="animate-fade-in">
            <div className="relative">
              {/* Main Card */}
              <Card className="card-premium overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Complete Business Transformation
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Everything you need to launch and scale your business successfully
                    </p>
                  </div>

                  {/* Outcomes List */}
                  <div className="space-y-3 mb-8">
                    {outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-xs text-muted-foreground">Week Program</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">85%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg animate-float">
                <div className="text-sm font-semibold">Next Cohort: March 2024</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-accent text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">Limited Spots Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;