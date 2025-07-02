import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      title: "Founder & Executive Director",
      bio: "Dr. Johnson brings over 15 years of experience in international development and women's empowerment. She holds a PhD in Economics from Oxford University and has worked with organizations across South Asia.",
      initials: "SJ"
    },
    {
      name: "Rajesh Sharma",
      title: "Program Director",
      bio: "Rajesh leads our entrepreneurship programs with deep expertise in business development and startup ecosystems. He has successfully launched over 50 businesses across Nepal.",
      initials: "RS"
    },
    {
      name: "Priya Thapa",
      title: "Training Coordinator",
      bio: "Priya oversees all training initiatives and curriculum development. She is a certified business trainer with extensive experience in adult learning and skill development.",
      initials: "PT"
    },
    {
      name: "Michael Chen",
      title: "Strategic Advisor",
      bio: "Michael provides strategic guidance on international partnerships and funding. He has over 20 years of experience in nonprofit management and sustainable development.",
      initials: "MC"
    },
    {
      name: "Anita Gurung",
      title: "Community Outreach Manager",
      bio: "Anita connects our programs with communities across Nepal. She has a background in social work and deep understanding of rural development challenges.",
      initials: "AG"
    },
    {
      name: "David Wilson",
      title: "Financial Advisor",
      bio: "David manages our financial planning and ensures transparent use of resources. He is a certified accountant with expertise in nonprofit financial management.",
      initials: "DW"
    }
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-primary text-white professional-spacing">
        <div className="professional-container text-center animate-fade-in">
          <h1 className="font-display text-4xl lg:text-hero font-bold mb-6 text-white">
            Meet Our Team
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-white/90">
            Dedicated professionals working together to unlock Nepal's economic potential through entrepreneurship and innovation
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="card-shadow border-0 h-full transition-smooth hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto card-shadow">
                      <span className="text-2xl font-bold text-primary">{member.initials}</span>
                    </div>
                  </div>
                  <CardTitle className="font-display text-xl font-bold text-foreground">
                    {member.name}
                  </CardTitle>
                  <p className="text-primary font-semibold">
                    {member.title}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="professional-spacing bg-muted">
        <div className="professional-container">
          <div className="text-center animate-fade-in">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8 lg:p-12 max-w-4xl mx-auto">
              <h3 className="font-display text-3xl lg:text-h2 font-bold text-foreground mb-4">
                Join Our Mission
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're always looking for passionate individuals who want to make a difference in Nepal's economic landscape. Whether as a team member or volunteer, your contribution matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Our Values */}
      <section className="professional-spacing bg-background">
        <div className="professional-container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl lg:text-h1 font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and unite our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">E</span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Empowerment</h3>
              <p className="text-muted-foreground">
                We believe in empowering individuals and communities to create their own success stories.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">I</span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace innovative approaches to solve complex economic challenges.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">I</span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Integrity</h3>
              <p className="text-muted-foreground">
                We operate with transparency, accountability, and ethical standards in everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;