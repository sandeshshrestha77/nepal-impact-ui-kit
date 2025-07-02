import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Target, Globe, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const StatsSection = () => {
  const [stats, setStats] = useState({
    participantsCount: 0,
    businessesLaunched: 0,
    programsCount: 0,
    successRate: 0,
    districtsReached: 0,
    livesImpacted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch participants count
      const { count: participantsCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true });

      // Fetch graduated participants (businesses launched)
      const { count: businessesLaunched } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('graduation_status', 'graduated');

      // Fetch programs count
      const { count: programsCount } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true });

      // Calculate success rate
      const successRate = participantsCount > 0 ? Math.round((businessesLaunched / participantsCount) * 100) : 0;

      // Fetch unique locations for districts reached
      const { data: locations } = await supabase
        .from('participants')
        .select('location')
        .not('location', 'is', null);

      const uniqueDistricts = new Set(locations?.map(p => p.location?.split(',')[0]?.trim()) || []).size;

      // Estimate lives impacted (participants * average family size)
      const livesImpacted = participantsCount * 5; // Assuming average family size of 5

      setStats({
        participantsCount: participantsCount || 0,
        businessesLaunched: businessesLaunched || 0,
        programsCount: programsCount || 0,
        successRate,
        districtsReached: uniqueDistricts,
        livesImpacted
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      icon: Users,
      number: loading ? "..." : `${stats.participantsCount}+`,
      label: "Women Entrepreneurs Trained",
      description: "Comprehensive business training and mentorship programs",
      growth: "+40% this year"
    },
    {
      icon: TrendingUp,
      number: loading ? "..." : `${stats.businessesLaunched}+`,
      label: "Businesses Successfully Launched",
      description: "From startup to sustainable revenue generation",
      growth: "+65% growth rate"
    },
    {
      icon: Award,
      number: loading ? "..." : `${stats.programsCount}+`,
      label: "Training Programs Conducted",
      description: "Specialized workshops and bootcamps across Nepal",
      growth: "12 locations"
    },
    {
      icon: Target,
      number: loading ? "..." : `${stats.successRate}%`,
      label: "Business Success Rate",
      description: "Businesses still operating after 2 years",
      growth: "Industry leading"
    },
    {
      icon: Globe,
      number: loading ? "..." : `${stats.districtsReached}`,
      label: "Districts Reached",
      description: "Expanding access across rural and urban Nepal",
      growth: "50% rural focus"
    },
    {
      icon: Heart,
      number: loading ? "..." : `${stats.livesImpacted}+`,
      label: "Lives Directly Impacted",
      description: "Including families and communities",
      growth: "Growing daily"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl lg:text-h1 font-bold mb-4 text-white">
            Our Growing Impact Across Nepal
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Since our founding, we've been dedicated to creating measurable, sustainable change 
            in Nepal's entrepreneurial ecosystem. Every number represents real lives transformed 
            and communities strengthened.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/10 border-white/20 text-white hover-lift animate-fade-in backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-3xl lg:text-4xl font-bold font-display text-accent">
                      {achievement.number}
                    </div>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                      {achievement.growth}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-lg font-bold text-white">
                    {achievement.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-white/80 leading-relaxed">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <div className="bg-white/5 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <h3 className="font-display text-xl font-bold mb-3 text-white">
              Ready to Join These Success Stories?
            </h3>
            <p className="text-white/90 mb-6">
              Whether you're an aspiring entrepreneur or want to support our mission, 
              there's a place for you in Nepal's economic transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary" asChild>
                <Link to="/get-involved">Start Your Journey</Link>
              </Button>
              <Button variant="cta" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;