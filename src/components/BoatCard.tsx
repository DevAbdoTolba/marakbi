import Image from 'next/image';
import Link from 'next/link';

interface BoatCardProps {
  boatId?: number;
  imageUrl: string;
  name: string;
  price: string;
  location: string;
  guests: number;
  status: string;
  rooms: number;
  rating?: number;
  reviewsCount?: number;
  guestCount?: number;
  priceMode?: string; // New prop
}

const BoatCard = ({ boatId, imageUrl, name, price, location, guests, status, rooms, rating = 0, reviewsCount = 0, guestCount, priceMode = 'per_time' }: BoatCardProps) => {
  // Determine label based on priceMode
  let priceUnit = ' /Hour';
  if (priceMode === 'per_trip') {
    priceUnit = ' /Trip';
  } else if (priceMode === 'per_person') {
    priceUnit = ' /Person';
  } else if (priceMode === 'per_person_per_time') {
    priceUnit = ' /Person/Hr';
  } else if (priceMode === 'per_day') {
    // Handling per_day explicit mode if it exists, or fallback
    priceUnit = ' /Day';
  }

  const cardContent = (
    <div className="relative z-0 w-96 h-[465px] bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden hover:shadow-xl transition-shadow" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Image Container with Rating Overlay */}
      <div className="relative w-full h-64 overflow-hidden rounded-lg">
        <Image
          className="w-full h-full object-cover rounded-lg"
          src={imageUrl}
          alt={name}
          width={384}
          height={256}
        />

        {/* Rating Overlay */}
        <div className="absolute top-1 right-1 bg-white rounded-tr-lg rounded-bl-lg px-3 py-2 flex items-center gap-2 shadow-lg">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Image
                key={i}
                src="/icons/Star Icon.svg"
                alt="Star"
                width={16}
                height={16}
                className={`w-4 h-4 ${i < Math.round(rating) ? 'opacity-100' : 'opacity-30'}`}
              />
            ))}
            <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
            {reviewsCount > 0 && (
              <span className="text-xs text-gray-500 ml-1">({reviewsCount})</span>
            )}
          </div>

          {/* Thumbs Up Icon */}
          <div className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
            <Image
              src="/icons/thumb_up.svg"
              alt="Thumbs Up"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Boat Name */}
        <div className="text-black text-xl font-semibold text-center mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {name}
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center mb-4">
          <Image
            src="/icons/Line 74.svg"
            alt="Decorative line"
            width={56}
            height={4}
            className="w-15 pt-1"
          />
        </div>

        {/* Location and Price Row */}
        <div className="flex justify-between items-center mb-4">
          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <Image
                src="/icons/location_on.svg"
                alt="Location"
                width={20}
                height={20}
                className="w-6 h-6"
              />
            </div>
            <span className="text-black text-base font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>{location}</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-sky-900 text-2xl font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>{price}</span>
            <span className="text-sky-900 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}> EGP</span>
            <span className="text-sky-900 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>{priceUnit}</span>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-stone-300 mb-4"></div>

        {/* Amenities Row */}
        <div className="flex justify-between items-center">
          {/* Guests */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <Image
                src="/icons/groups_2.svg"
                alt="Guests"
                width={20}
                height={20}
                className="w-7 h-6"
              />
            </div>
            <span className="text-black text-sm font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>{guests} Guest</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <Image
                src="/icons/award_meal.svg"
                alt="Available"
                width={20}
                height={20}
                className="w-7 h-6"
              />
            </div>
            <span className="text-black text-sm font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>{status}</span>
          </div>

          {/* Rooms */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <Image
                src="/icons/bed.svg"
                alt="Rooms"
                width={20}
                height={20}
                className="w-7 h-6"
              />
            </div>
            <span className="text-black text-sm font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>{rooms} Rooms</span>
          </div>
        </div>
      </div>
    </div>
  );

  const href = boatId ? `/boat-details/${boatId}${guestCount ? `?guest_count=${guestCount}` : ''}` : '#';

  return boatId ? (
    <Link href={href} className="block cursor-pointer">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default BoatCard;