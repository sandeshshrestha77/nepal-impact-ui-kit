import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import EventsSection from '@/components/home/EventsSection';
import ImpactPillarsSection from '@/components/home/ImpactPillarsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <ImpactPillarsSection />
    </Layout>
  );
};

export default Home;