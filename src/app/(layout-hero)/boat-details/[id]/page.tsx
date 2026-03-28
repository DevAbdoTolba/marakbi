"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { clientApi, BoatDetails as ApiBoatDetails, Trip, BASE_URL, BoatServiceAssociation } from "@/lib/api";
import BookingSidebar, { BookingData } from "@/components/BookingSidebar";
import { normalizeImageUrl, normalizeImageUrls } from "@/lib/imageUtils";
import { FiClock, FiMapPin } from "react-icons/fi";

export default function BoatDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [boatData, setBoatData] = useState<ApiBoatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Trip-based booking support
  const tripId = searchParams.get("trip_id");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentTripImageIndex, setCurrentTripImageIndex] = useState(0);

  // Auto-advance trip image slider
  useEffect(() => {
    if (!selectedTrip?.images || selectedTrip.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTripImageIndex((prev) => (prev + 1) % selectedTrip.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedTrip?.images]);

  useEffect(() => {
    const fetchBoatDetails = async () => {
      try {
        setLoading(true);
        const response = await clientApi.getBoatById(parseInt(params.id as string));
        if (response.success && response.data) {
          setBoatData(response.data);

          // If trip_id is provided, find the matching trip
          if (tripId && response.data.boat.trips) {
            const topicTrip = response.data.boat.trips.find(t => t.id === parseInt(tripId));
            if (topicTrip) {
              // Initially set from boat data
              setSelectedTrip(topicTrip as unknown as Trip);

              // Fetch full trip details to get images
              try {
                const tripRes = await fetch(`${BASE_URL}/client/trips/${tripId}`);
                if (tripRes.ok) {
                  const fullTrip = await tripRes.json();
                  setSelectedTrip(fullTrip);
                }
              } catch (err) {
                console.error("Error fetching full trip details", err);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching boat details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBoatDetails();
    }
  }, [params.id, tripId]);

  // Handle keyboard navigation for image modal
  useEffect(() => {
    if (!isModalOpen || !boatData) return;

    const normalizedImages = normalizeImageUrls(boatData.boat.images);
    if (normalizedImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % normalizedImages.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, boatData]);

  const handleRequestToBook = (bookingData: BookingData) => {
    const completeBookingData = {
      ...bookingData,
      boat_image: normalizeImageUrl(boatData?.boat.images[0]),
      price_per_hour: boatData?.boat.price_per_hour,
      price_per_day: boatData?.boat.price_per_day || (boatData?.boat.price_per_hour || 0) * 8,
      max_seats: boatData?.boat.max_seats,
      // Include trip data if this is a trip-based booking
      trip_id: selectedTrip?.id,
      trip_name: selectedTrip?.name,
      trip_description: selectedTrip?.description,
      trip_image: selectedTrip?.images && selectedTrip.images.length > 0 ? normalizeImageUrl(selectedTrip.images[0]) : null,
      trip_images: selectedTrip?.images ? normalizeImageUrls(selectedTrip.images) : [],
      trip_price: selectedTrip?.total_price,
      trip_duration: selectedTrip?.voyage_hours,
      is_trip_booking: !!selectedTrip,
      boat_rating: reviews_summary.average_rating,
      boat_total_reviews: reviews_summary.total_reviews,
    };

    localStorage.setItem('booking_data', JSON.stringify(completeBookingData));
    router.push('/payment');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-poppins">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading boat details...</p>
      </div>
    );
  }

  if (!boatData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-poppins">
        <h1 className="text-3xl font-bold mb-4">Boat not found</h1>
        <p className="text-gray-600">The boat you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const { boat, owner, reviews, reviews_summary } = boatData;
  const totalRating = reviews_summary.total_reviews;

  const normalizedImages = normalizeImageUrls(boat.images);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const handleMobileNext = () => {
    setMobileImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const handleMobilePrev = () => {
    setMobileImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleMobileNext();
      } else {
        handleMobilePrev();
      }
    }
    setIsDragging(false);
  };

  return (
    <div className="bg-white">
      {/* Owner & Trip Title Section */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={owner.avatar_url || "/icons/character-3.svg"}
            alt={owner.username}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-lg">{owner.username}</p>
            <p className="text-sm text-gray-600">Boat Owner</p>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 font-poppins">
          {boat.name}
        </h1>

        {/* Trip Info Banner - shown when accessing boat via trip listing */}
        {selectedTrip && (
          <div className="mb-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Trip Image */}
              {/* Trip Image Slider */}
              <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden bg-gray-900 group">
                {selectedTrip.images && selectedTrip.images.length > 0 ? (
                  <>
                    {selectedTrip.images.map((img, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentTripImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                      >
                        <Image
                          src={normalizeImageUrl(img)}
                          alt={`${selectedTrip.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay for text visibility if needed */}
                        <div className="absolute inset-0 bg-black/10"></div>
                      </div>
                    ))}

                    {/* Slider Indicators/Dots */}
                    {selectedTrip.images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5">
                        {selectedTrip.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent accidental navigation if nested
                              setCurrentTripImageIndex(index);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentTripImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sky-900 shadow-sm">
                  Trip
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 font-poppins">{selectedTrip.name}</h2>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Trip Price</p>
                      <p className="text-2xl font-bold text-sky-900">E£ {selectedTrip.total_price}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">{selectedTrip.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="text-sky-700 text-lg" />
                    <span>{selectedTrip.voyage_hours} Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-sky-700 text-lg" />
                    <span>{selectedTrip.city_name}</span>
                  </div>
                  {selectedTrip.trip_type && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                      <span>{selectedTrip.trip_type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout: Left Content + Right Sidebar */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content - Gallery + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div>
              {/* Mobile View - Single Image Carousel */}
              <div className="block md:hidden">
                {normalizedImages.length > 0 ? (
                  <div className="relative">
                    {/* Main Image */}
                    <div
                      className="relative w-full h-[400px] rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleImageClick(mobileImageIndex)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <Image
                        src={normalizedImages[mobileImageIndex]}
                        alt={`Boat image ${mobileImageIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />

                      {/* Image Counter Overlay - Top Left */}
                      {normalizedImages.length > 1 && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                          {mobileImageIndex + 1} / {normalizedImages.length}
                        </div>
                      )}

                      {/* Remaining Images Indicator - Bottom Right */}
                      {normalizedImages.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                          {normalizedImages.length - mobileImageIndex - 1 > 0
                            ? `+${normalizedImages.length - mobileImageIndex - 1} صور`
                            : 'آخر صورة'}
                        </div>
                      )}

                      {/* Previous Button - FORCED LEFT */}
                      {normalizedImages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMobilePrev();
                          }}
                          // استخدمنا style left عشان نجبره يروح شمال بغض النظر عن اتجاه الموقع
                          className="absolute top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2.5 hover:bg-black/90 transition-colors shadow-lg z-10"
                          style={{ left: '10px' }}
                          aria-label="Previous image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Next Button - FORCED RIGHT */}
                      {normalizedImages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMobileNext();
                          }}
                          // استخدمنا style right عشان نجبره يروح يمين بغض النظر عن اتجاه الموقع
                          className="absolute top-1/2 -translate-y-1/2 bg-black/70 text-white rounded-full p-2.5 hover:bg-black/90 transition-colors shadow-lg z-10"
                          style={{ right: '10px' }}
                          aria-label="Next image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Navigation Dots */}
                    {normalizedImages.length > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4">
                        {normalizedImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setMobileImageIndex(idx)}
                            className={`transition-all duration-300 ${idx === mobileImageIndex
                              ? 'w-8 h-2 bg-[#106BD8] rounded-full'
                              : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                              }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {/* Desktop View - Grid Layout */}
              <div className="hidden md:grid grid-cols-4 gap-2 h-[400px]">
                {normalizedImages.length > 0 ? (
                  <>
                    <div
                      className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(0)}
                    >
                      <Image
                        src={normalizedImages[0]}
                        alt="Main boat"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    {normalizedImages.slice(1, 5).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(idx + 1)}
                      >
                        <Image
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {idx === 3 && normalizedImages.length > 5 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-3xl font-semibold">
                              +{normalizedImages.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="col-span-4 flex items-center justify-center bg-gray-200 rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src="/icons/Star Icon.svg"
                      alt="Star"
                      width={20}
                      height={20}
                      className={`${i < Math.floor(reviews_summary.average_rating) ? "opacity-100" : "opacity-30"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{reviews_summary.average_rating.toFixed(1)}</span>
                <span className="text-gray-600">({reviews_summary.total_reviews})</span>
                <span className="mx-2">•</span>
                <span className="text-gray-700">{boat.categories.join(', ')}</span>
              </div>
            </div>
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 font-poppins">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{boat.description}</p>
            </section>

            {/* Specifications */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 font-poppins">Specifications</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 mb-1 sm:mb-0">Maximum Capacity</span>
                  <span className="text-gray-600 sm:text-right">{boat.max_seats} Guests</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 mb-1 sm:mb-0">Sleeping Capacity</span>
                  <span className="text-gray-600 sm:text-right">{boat.max_seats_stay} Guests</span>
                </div>
                {boat.price_per_hour && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Price Per Hour</span>
                    <span className="text-gray-600 sm:text-right">{boat.price_per_hour} EGP</span>
                  </div>
                )}
                {boat.price_per_day && (
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700 mb-1 sm:mb-0">Price Per Day</span>
                    <span className="text-gray-600 sm:text-right">{boat.price_per_day} EGP</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 mb-1 sm:mb-0">Categories</span>
                  <span className="text-gray-600 sm:text-right">{boat.categories.join(', ')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 mb-1 sm:mb-0">Owner</span>
                  <span className="text-gray-600 sm:text-right">{owner.username}</span>
                </div>
              </div>
            </section>


            {/* Available Services */}
            {boat.services && boat.services.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-poppins">Available Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {boat.services.map((assoc: BoatServiceAssociation) => {
                    const service = assoc.service;
                    if (!service) return null;
                    const price = assoc.price ?? service.default_price;
                    const priceModeLabel =
                      service.price_mode === 'per_person'
                        ? 'Per Person'
                        : service.price_mode === 'per_person_per_time'
                          ? 'Per Person/Time'
                          : 'Per Trip';

                    return (
                      <div
                        key={assoc.service_id}
                        className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                          {service.icon_url ? (
                            <Image
                              src={normalizeImageUrl(service.icon_url)}
                              alt={service.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 font-poppins">{service.name}</h3>
                          {service.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {price != null && (
                              <span className="text-xs font-medium text-[#0f3875]">{Number(price).toFixed(2)} EGP</span>
                            )}
                            <span className="text-[10px] text-gray-500 bg-gray-200 rounded px-1.5 py-0.5">
                              {priceModeLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Meet Your Captain */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 font-poppins">Meet Your Captain</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={owner.avatar_url || "/icons/character-3.svg"}
                    alt={owner.username}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold font-poppins">
                      {owner.username}
                    </h3>
                    <p className="text-orange-600 text-sm mb-2">
                      Member since {new Date(owner.member_since).getFullYear()}
                    </p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Image
                          key={i}
                          src="/icons/Star Icon.svg"
                          alt="Star"
                          width={16}
                          height={16}
                          className={`${i < Math.floor(reviews_summary.average_rating) ? "opacity-100" : "opacity-30"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{owner.bio || 'No bio available.'}</p>
                <div className="space-y-2 mb-4">
                  {owner.address && (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/location_on.svg"
                        alt="Address"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm">Address: {owner.address}</span>
                    </div>
                  )}
                </div>
                <button className="w-full sm:w-auto px-8 py-3 bg-[#0C4A8C] text-white rounded-lg hover:bg-[#0A3D7A] transition-colors">
                  Contact Owner
                </button>
              </div>
            </section>

            {/* Pricing options */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 font-poppins">Pricing Options</h2>
              <div className="space-y-3">
                {boat.price_per_hour && (
                  <div>
                    <p className="font-semibold">Per Hour Rental</p>
                    <p className="text-gray-600">From {boat.price_per_hour} EGP</p>
                  </div>
                )}
                {boat.price_per_day && (
                  <div>
                    <p className="font-semibold">Per Day Rental</p>
                    <p className="text-gray-600">From {boat.price_per_day} EGP</p>
                  </div>
                )}
              </div>
            </section>

            {/* Customer reviews */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 font-poppins">Customer Reviews</h2>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Rating Summary */}
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{reviews_summary.average_rating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        src="/icons/Star Icon.svg"
                        alt="Star"
                        width={32}
                        height={32}
                        className={`${i < Math.floor(reviews_summary.average_rating) ? "opacity-100" : "opacity-30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Based on {totalRating} Reviews
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews_summary.star_breakdown[`${stars}_stars` as keyof typeof reviews_summary.star_breakdown] || 0;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="w-16 text-sm">{stars} Star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400"
                            style={{
                              width: totalRating > 0 ? `${(count / totalRating) * 100}%` : '0%',
                            }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                ) : (
                  (showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold">
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{review.username}</p>
                          <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Image
                            key={i}
                            src="/icons/Star Icon.svg"
                            alt="Star"
                            width={16}
                            height={16}
                            className={`${i < review.rating ? "opacity-100" : "opacity-30"}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-6 px-8 py-3 border-2 border-[#0C4A8C] text-[#0C4A8C] rounded-lg hover:bg-[#0C4A8C] hover:text-white transition-colors"
                >
                  {showAllReviews ? "Show Less" : "Show All Comments"}
                </button>
              )}
            </section>
          </div>

          {/* Right Sidebar - Booking (Fixed Position) */}
          <div className="lg:col-span-1">
            <div>
              <BookingSidebar
                boatId={boat.id}
                boatName={boat.name}
                pricePerHour={boat.price_per_hour}
                pricePerDay={boat.price_per_day}
                maxGuests={boat.max_seats}
                serviceFeeRate={boatData.service_fee_rate}
                onBookingRequest={handleRequestToBook}
                isTripBooking={!!selectedTrip}
                tripDuration={selectedTrip?.voyage_hours}
                tripPrice={selectedTrip?.total_price}
                initialGuestCount={searchParams.get("guest_count") ? parseInt(searchParams.get("guest_count")!) : (searchParams.get("min_passengers") ? parseInt(searchParams.get("min_passengers")!) : 2)}
                locationUrl={boat.location_url}
                priceMode={boat.price_mode as "per_time" | "per_person" | "per_person_per_time" | "per_trip"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {isModalOpen && normalizedImages.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
          // هنا برضوا بنجبر اتجاه المودال عشان زرار الكلوز يظبط
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, direction: 'ltr' }}
        >
          {/* Close Button - FORCED RIGHT */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            // اجبار المكان بالـ style
            className="absolute top-6 text-white hover:text-gray-300 transition-colors bg-black/60 rounded-full p-2 hover:bg-black/80"
            style={{ right: '24px', zIndex: 10000 }}
            aria-label="Close modal"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image Container - Centered */}
          <div
            className="relative w-full h-full flex items-center justify-center px-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button - FORCED LEFT */}
            {normalizedImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute text-white hover:text-gray-300 transition-colors bg-black/60 rounded-full p-4 hover:bg-black/80 flex items-center justify-center"
                style={{ left: '16px', zIndex: 10000 }}
                aria-label="Previous image"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Main Image */}
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex items-center justify-center">
              <Image
                src={normalizedImages[currentImageIndex]}
                alt={`Boat image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-full"
                priority
              />
            </div>

            {/* Next Button - FORCED RIGHT */}
            {normalizedImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute text-white hover:text-gray-300 transition-colors bg-black/60 rounded-full p-4 hover:bg-black/80 flex items-center justify-center"
                style={{ right: '16px', zIndex: 10000 }}
                aria-label="Next image"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Image Counter - Bottom Center */}
          {normalizedImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {normalizedImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}