'use client';

import BoatCard from './BoatCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clientApi, Boat, HomeData } from '@/lib/api';
import Image from 'next/image';

interface BoatFleetProps {
  homeData?: HomeData;
}

const BoatFleet = ({ homeData }: BoatFleetProps) => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        // جلب 6 مراكب من الـ API أو استخدام new_joiners من homeData
        if (homeData?.new_joiners && homeData.new_joiners.length > 0) {
          setBoats(homeData.new_joiners.slice(0, 6));
        } else {
          const response = await clientApi.getBoats(1, 6);
          if (response.success && response.data) {
            const validBoats = response.data.boats.filter(boat => {
              const hasHourly = boat.price_per_hour !== null && boat.price_per_hour !== undefined;
              const hasDaily = boat.price_per_day !== null && boat.price_per_day !== undefined;
              return hasHourly || hasDaily;
            });
            setBoats(validBoats);
          }
        }
      } catch (error) {
        console.error('Error fetching boats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoats();
  }, [homeData]);
  return (
    <section className="relative w-full overflow-hidden py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat h-110"
        style={{ backgroundImage: "url('/images/Frame 1321316346.webp')" }}
      ></div>



      <div className="relative">
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center mb-10">

          {/* Title */}
          <h2 className="text-white text-3xl md:text-5xl font-semibold font-poppins mb-4 mt-4">
            Fleet of Luxury Boats
          </h2>

          {/* Golden Wavy Line - Mobile Only */}
          <div className="flex justify-center mb-4 md:hidden">
            <Image
              src="/icons/Line 74.svg"
              alt="Decorative line"
              width={200}
              height={16}
              className="h-4"
            />
          </div>

          {/* Description */}
          <p className="text-white text-s font-normal font-poppins max-w-4xl leading-relaxed px-4 mb-6">
            Explore our exquisite collection of high-end yachts and premium vessels, perfect for tailored trips across Aswan&apos;s majestic Nile and Egypt&apos;s stunning Red Sea.
          </p>

          {/* Golden Wavy Line - Desktop Only */}
          <div className="hidden md:flex justify-center">
            <Image
              src="/icons/Line 74.svg"
              alt="Decorative line"
              width={200}
              height={16}
              className="h-4"
            />
          </div>
        </div>

        {/* Boat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-6xl lg:max-w-7xl mx-auto mb-12 px-4 lg:px-0 place-items-center md:place-items-stretch lg:place-items-start">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto"></div>
              <p className="text-white mt-4">Loading boats...</p>
            </div>
          ) : boats.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white text-lg">No boats available at the moment.</p>
            </div>
          ) : (
            boats.map((boat, index: number) => {
              const displayPrice = (boat.price_per_hour !== null && boat.price_per_hour !== undefined)
                ? boat.price_per_hour
                : (boat.price_per_day ?? 0);

              const displayMode = (boat.price_per_hour !== null && boat.price_per_hour !== undefined)
                ? boat.price_mode
                : 'per_day';

              return (
                <BoatCard
                  key={boat.id || index}
                  boatId={boat.id}
                  imageUrl={boat.images?.[0] || '/images/Rectangle 3463853.webp'}
                  name={boat.name || 'Boat'}
                  price={`${displayPrice}`}
                  location={boat.cities?.[0] || 'Aswan - Egypt'}
                  guests={boat.max_seats || 4}
                  status="Available"
                  rooms={boat.max_seats_stay || 2}
                  rating={boat.average_rating ?? 0}
                  reviewsCount={boat.total_reviews || 0}
                  priceMode={displayMode}
                />
              );
            })
          )}
        </div>

        {/* View All Boats Button */}
        <div className="text-center px-4">
          <Link href="/boat-listing" className="w-full max-w-md sm:w-auto sm:min-w-[280px] h-12 px-8 py-2.5 bg-[#0C4A8C] rounded-lg text-white text-base font-normal font-poppins capitalize hover:bg-[#0A3D7A] transition-colors inline-flex justify-center items-center">
            View All Boats
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BoatFleet;