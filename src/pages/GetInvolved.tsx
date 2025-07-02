import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Users, HandHeart, Heart, Award, TrendingUp, Calendar } from 'lucide-react';

const GetInvolved = () => {
  const ctaOptions = [
    {
      icon: Users,
      title: "Join AWE Bootcamp",
      description: "Transform your business idea into reality with our comprehensive 12-week Academy for Women Entrepreneurs program.",
      benefits: ["Business skills training", "Mentorship network", "Access to funding", "Peer community"],
      buttonText: "Apply Now",
      buttonVariant: "hero" as const,
      featured: true
    },
    {
      icon: HandHeart,
      title: "Volunteer",
      description: "Share your expertise and time to empower the next generation of entrepreneurs in Nepal.",
      benefits: ["Skill-based volunteering", "Mentoring opportunities", "Event support", "Community impact"],
      buttonText: "Learn More",
      buttonVariant: "secondary" as const,
      featured: false
    },
    {
      icon: Heart,
      title: "Donate/Partner",
      description: "Support our mission through financial contributions or strategic partnerships.",
      benefits: ["Tax deductible", "Direct impact", "Partnership opportunities", "Regular updates"],
      buttonText: "Support Us",
      buttonVariant: "cta" as const,
      featured: false
    }
  ];

  const impactStats = [
    { number: "500+", label: "Women Empowered", icon: Users },
    { number: "150+", label: "Businesses Supported", icon: TrendingUp },
    { number: "25+", label: "Events Conducted", icon: Calendar },
    { number: "85%", label: "Success Rate", icon: Award }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white professional-spacing">
        <div className="professional-container text-center animate-fade-in">
          <h1 className="font-display text-4xl lg:text-hero font-bold mb-6 text-white">
            Be Part of the Change
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-white/90 mb-8">
            Join us in unlocking Nepal's economic potential and creating opportunities for women entrepreneurs across the nation
          </p>
          <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary" asChild>
            <Link to="#opportunities">Explore Opportunities</Link>
          </Button>
        </div>
      </section>

      {/* CTA Options Grid */}
      <section id="opportunities" className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
              Ways to Get Involved
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose how you'd like to contribute to Nepal's economic transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {ctaOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={index} 
                  className={`card-shadow border-0 h-full transition-smooth hover:scale-105 animate-fade-in ${
                    option.featured ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    {option.featured && (
                      <Badge className="mb-4 bg-accent text-accent-foreground mx-auto w-fit">
                        Featured Program
                      </Badge>
                    )}
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl font-bold text-foreground">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground text-sm">What's Included:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button variant={option.buttonVariant} size="lg" className="w-full">
                      {option.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="professional-spacing bg-muted">
        <div className="professional-container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
              Our Growing Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the tangible difference we're making together in Nepal's entrepreneurial ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card 
                  key={index} 
                  className="card-shadow border-0 text-center animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold font-display text-foreground mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl lg:text-h2 font-bold text-foreground mb-4">
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-muted-foreground">
                Get in touch with us to learn more about how you can contribute to Nepal's economic transformation
              </p>
            </div>

            <Card className="card-shadow border-0">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      Connect With Us
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Have questions or want to discuss partnership opportunities? We'd love to hear from you.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Button variant="hero" size="lg" className="w-full" asChild>
                      <a href="mailto:info@impactinitiativenepal.com">
                        Email Us Directly
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link to="/contact">Visit Contact Page</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;