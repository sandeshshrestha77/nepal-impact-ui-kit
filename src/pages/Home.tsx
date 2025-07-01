import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import EventsSection from '@/components/home/EventsSection';
import ImpactPillarsSection from '@/components/home/ImpactPillarsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ProgramsSection />
      <TestimonialsSection />
      <EventsSection />
      <ImpactPillarsSection />
    </Layout>
  );
};

export default Home;