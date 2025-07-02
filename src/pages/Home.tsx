import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import ImpactPillarsSection from '@/components/home/ImpactPillarsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <ImpactPillarsSection />
    </Layout>
  );
};

export default Home;