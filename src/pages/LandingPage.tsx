import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ContentPreview } from '../components/ContentPreview';
import { DeviceSection } from '../components/DeviceSection';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { SubscriptionPlans } from '../components/SubscriptionPlans';
import { SubscriptionPlan } from '../types';

interface LandingPageProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPlan }) => {
  return (
    <div>
      <Header />
      <Hero />
      <ContentPreview />
      <DeviceSection />
      <SubscriptionPlans onSelectPlan={onSelectPlan} />
      <FAQ />
      <Footer />
    </div>
  );
};
