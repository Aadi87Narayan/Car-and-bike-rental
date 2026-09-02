import React, { useEffect } from 'react';
import { Hero } from '../components/Hero/Hero';
import { Benefits } from '../components/Benefits/Benefits';
import { CarCategories } from '../components/CarCategories/CarCategories';
import { FeaturedCars } from '../components/FeaturedCars/FeaturedCars';
import { WhyChooseUs } from '../components/WhyChooseUs/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks/HowItWorks';
import { Testimonials } from '../components/Testimonials/Testimonials';
import { CTA } from '../components/CTA/CTA';

export function Home() {
  useEffect(() => {
    document.title = "DriveX | Premium 3D Car Rental Experience";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="home-page-container">
      {/* 1. Hero with 3D Car & Booking Search */}
      <Hero />

      {/* 2. Value Benefits */}
      <Benefits />

      {/* 3. Browse by Car Type */}
      <CarCategories />

      {/* 4. Popular / Featured Fleet */}
      <FeaturedCars />

      {/* 5. The DriveX Advantage */}
      <WhyChooseUs />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Driver Testimonials */}
      <Testimonials />

      {/* 8. Call To Action Banner */}
      <CTA />
    </main>
  );
}
