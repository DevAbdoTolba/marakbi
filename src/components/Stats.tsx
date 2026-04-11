'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Stats = () => {
  const [boatOwners, setBoatOwners] = useState(0);
  const [waterActivities, setWaterActivities] = useState(0);
  const [availableTrips, setAvailableTrips] = useState(0);
  const [tripsDone, setTripsDone] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate Boat Owners
            animateValue(setBoatOwners, 0, 100, 2000);
            
            // Animate Water Activities
            animateValue(setWaterActivities, 0, 100, 2000);
            
            // Animate Available Trips
            animateValue(setAvailableTrips, 0, 157, 2000);
            
            // Animate Trips Done
            animateValue(setTripsDone, 0, 10, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated]);

  const animateValue = (setter: (value: number) => void, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (end - start) * easeOutQuart);
      
      setter(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <section ref={sectionRef} className="relative py-8 sm:py-16">
      {/* Background Image - Hidden on Mobile */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/wmap.webp"
          alt="World Map Background"
          width={1600}
          height={300}
          className="w-[1600px] h-[300px] object-contain"
        />
      </div>

      {/* Stats Cards */}
      <div className="relative container mx-auto px-4 mt-8 sm:mt-16 mb-8 sm:mb-16">
        {/* Mobile View - Stack Cards */}
        <div className="grid grid-cols-1 md:hidden gap-6 max-w-md mx-auto">
          {/* Boat Owners */}
          <div className="h-64 bg-purple-700 rounded-2xl flex flex-col justify-center items-center shadow-lg py-8">
            <div className="text-white text-7xl font-bold font-poppins">{boatOwners} +</div>
            <div className="text-white text-2xl font-normal font-poppins text-center mt-4">Boat Owners</div>
          </div>

          {/* Water Activities */}
          <div className="h-64 bg-[#C8A467] rounded-2xl flex flex-col justify-center items-center shadow-lg py-8">
            <div className="text-white text-7xl font-bold font-poppins">{waterActivities} +</div>
            <div className="text-white text-2xl font-normal font-poppins text-center mt-4">Water Activities</div>
          </div>

          {/* Available Trips */}
          <div className="h-64 bg-teal-500 rounded-2xl flex flex-col justify-center items-center shadow-lg py-8">
            <div className="text-white text-7xl font-bold font-poppins">{availableTrips} +</div>
            <div className="text-white text-2xl font-normal font-poppins text-center mt-4">Available Trips</div>
          </div>

          {/* Trips Done */}
          <div className="h-64 bg-red-500 rounded-2xl flex flex-col justify-center items-center shadow-lg py-8">
            <div className="text-white text-7xl font-bold font-poppins">{tripsDone} +</div>
            <div className="text-white text-2xl font-normal font-poppins text-center mt-4">Trips Done</div>
          </div>
        </div>

        {/* Desktop View - Original Layout */}
        <div className="hidden md:flex justify-center gap-6 max-w-6xl mx-auto">
          {/* Boat Owners */}
          <div className="w-64 h-46 bg-purple-700 rounded-2xl flex flex-col justify-center items-center shadow-lg">
            <div className="text-white text-[66px] font-bold font-poppins capitalize">{boatOwners} +</div>
            <div className="text-white text-[23px] font-normal font-poppins text-center capitalize">Boat Owners</div>
          </div>

          {/* Water Activities */}
          <div className="w-64 h-46 bg-orange-300 rounded-2xl flex flex-col justify-center items-center shadow-lg mt-16">
            <div className="text-white text-[66px] font-bold font-poppins capitalize">{waterActivities} +</div>
            <div className="text-white text-[23px] font-normal font-poppins text-center capitalize">Water Activities</div>
          </div>

          {/* Available Trips */}
          <div className="w-64 h-46 bg-teal-500 rounded-2xl flex flex-col justify-center items-center shadow-lg">
            <div className="text-white text-[66px] font-bold font-poppins capitalize">{availableTrips} +</div>
            <div className="text-white text-[23px] font-normal font-poppins text-center capitalize">Available Trips</div>
          </div>

          {/* Trips Done */}
          <div className="w-64 h-46 bg-red-500 rounded-2xl flex flex-col justify-center items-center shadow-lg mt-16">
            <div className="text-white text-[66px] font-bold font-poppins capitalize">{tripsDone} +</div>
            <div className="text-white text-[23px] font-normal font-poppins text-center capitalize">Trips Done</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Stats;
