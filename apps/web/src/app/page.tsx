'use client';

import React from 'react';
import { Hero } from '../components/Hero';
import { BentoStats } from '../components/BentoStats';
import { DirectionsSection } from '../components/DirectionsSection';
import { NewsSection } from '../components/NewsSection';
import { GalleryPreview } from '../components/GalleryPreview';
import { AdmissionBanner } from '../components/AdmissionBanner';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BentoStats />
      <DirectionsSection />
      <NewsSection />
      <GalleryPreview />
      <AdmissionBanner />
    </div>
  );
}
