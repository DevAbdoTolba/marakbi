"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi, Boat } from "@/lib/api";

export default function BoatMarketPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await clientApi.getBoats();
        if (response.success && response.data) {
          // Filter boats that have a sale price set
          const forSale = (response.data.boats || []).filter(
            (b: Boat) => b.sale_price && b.sale_price > 0
          );
          setBoats(forSale);
        }
      } catch (err) {
        console.error("Failed to load market boats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-3">
            Buy & Sell
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-black font-poppins mb-4">
            Buy/Sell
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Browse boats available for purchase or list your own boat for sale
          </p>
        </div>
      </div>

      {/* Boats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
          </div>
        ) : boats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boats.map((boat) => (
              <Link
                key={boat.id}
                href={`/boat-details/${boat.id}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={
                        boat.images?.[0] ||
                        "/images/placeholder-boat.webp"
                      }
                      alt={boat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#093B77] text-white text-sm font-poppins font-semibold px-3 py-1 rounded-full">
                      For Sale
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-black font-poppins mb-1">
                      {boat.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm font-poppins mb-3">
                      <Image
                        src="/icons/location_on.svg"
                        alt="Location"
                        width={16}
                        height={16}
                      />
                      <span>{boat.cities?.[0] || "Egypt"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sky-900 text-2xl font-bold font-poppins">
                          {(boat.sale_price || 0).toLocaleString()}
                        </span>
                        <span className="text-sky-900 text-sm font-poppins ml-1">
                          EGP
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 font-poppins">
                        Sale Price
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18M3 9h18m-9 6h9M3 15h3m-3 6h18"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
              No Boats Listed Yet
            </h3>
            <p className="text-gray-500 font-poppins max-w-md mx-auto">
              The boat market is coming soon. Check back later for boats
              available for purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
