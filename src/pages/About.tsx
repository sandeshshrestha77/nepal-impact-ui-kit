import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Briefcase, Users, HandHeart, Award, CircleDollarSign } from 'lucide-react';

const About = () => {
  const pillars = [
    {
      icon: Briefcase,
      title: "Accelerating Job Creation",
      description: "We create sustainable employment opportunities through comprehensive entrepreneurship development programs, business incubation support, and strategic partnerships with local and international organizations."
    },
    {
      icon: Users,
      title: "Unlocking Women's Economic Potential", 
      description: "Our Academy for Women Entrepreneurs (AWE) empowers women with essential business skills, access to funding networks, mentorship programs, and the confidence needed to build and scale successful enterprises."
    },
    {
      icon: HandHeart,
      title: "Empowering Local Economies",
      description: "We strengthen community-based businesses through capacity building, resource mobilization, and creating networks that foster local economic resilience and sustainable growth across Nepal's diverse regions."
    },
    {
      icon: Award,
      title: "Creating Skilled Workforce & Entrepreneurial Ecosystem",
      description: "Through training programs, workshops, and ecosystem development initiatives, we build the human capital and institutional framework necessary for innovation and entrepreneurship to flourish."
    },
    {
      icon: CircleDollarSign,
      title: "Supporting Sustainable Development Goals",
      description: "Our work directly contributes to UN SDGs, particularly Goal 8 (Decent Work and Economic Growth), Goal 5 (Gender Equality), and Goal 1 (No Poverty), ensuring our impact aligns with global development priorities."
    }
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-primary text-white professional-spacing">
        <div className="professional-container text-center animate-fade-in">
          <h1 className="font-display text-hero font-bold mb-8 text-white">
            Impact Initiative Nepal
          </h1>
          <p className="text-body-lg max-w-4xl mx-auto text-white/90 leading-relaxed">
            Transforming Nepal's economic landscape through strategic empowerment of women entrepreneurs and local business communities
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <h2 className="font-display text-h1 font-bold text-foreground mb-10">
              Our Mission
            </h2>
            <div className="prose-professional space-y-8">
              <p className="text-body-lg leading-relaxed text-muted-foreground">
                Impact Initiative Nepal (IIN) is a purpose-driven non-profit organization committed to unlocking Nepal's economic potential and strategically founded to be a transformative force for Nepal's economy by empowering local entrepreneurs to lead the charge toward inclusive growth and national prosperity.
              </p>
              <p className="text-body-lg leading-relaxed text-muted-foreground">
                We support the Government of Nepal's ambitious vision of transitioning to a middle-income country by 2030 through targeted interventions that address systemic challenges including limited access to financing, inadequate business services, and the need for enhanced managerial capabilities among entrepreneurs.
              </p>
              <p className="text-body-lg leading-relaxed text-muted-foreground">
                Our comprehensive approach focuses on creating an enabling environment where businesses can thrive, jobs are created, and economic opportunities are accessible to all, particularly women and marginalized communities who have historically been underrepresented in Nepal's economic landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Pillars */}
      <section className="professional-spacing bg-muted">
        <div className="professional-container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-h1 font-bold text-foreground mb-6">
              Five Impact Pillars
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              Our strategic framework for creating sustainable economic transformation across Nepal
            </p>
          </div>

          <div className="professional-grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
            {pillars.map((pillar, index) => {
              const IconComponent = pillar.icon;
              return (
                <Card 
                  key={index} 
                  className="card-professional h-full animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-display text-xl font-bold text-foreground">
                        {pillar.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="text-center animate-fade-in">
            <div className="cta-section max-w-5xl mx-auto">
              <h3 className="font-display text-h2 font-bold text-foreground mb-6">
                Join the Movement
              </h3>
              <p className="text-body-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                Be part of Nepal's economic transformation. Whether you're an entrepreneur, supporter, or advocate, there's a place for you in our mission to create lasting change.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/get-involved">Get Involved</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;