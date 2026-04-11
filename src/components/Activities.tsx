import Image from 'next/image';

const Activities = () => {
  const activities = [
    { src: '/images/Rectangle 3463860.webp', title: 'Water Sports', height: 'h-150' },
    { src: '/images/Rectangle 3463863.webp', title: 'Family Activities', height: 'h-150' },
    { src: '/images/Rectangle 3463861.webp', title: 'Boat Rides', height: 'h-200' },
    { src: '/images/Rectangle 3463865.webp', title: 'Cruises', height: 'h-100' },
    { src: '/images/Rectangle 3463862.webp', title: 'Fishing Trips', height: 'h-150' },
    { src: '/images/Rectangle 3463864.webp', title: 'Snorkelling & Diving', height: 'h-150' },
  ];

  return (
    <section className="relative py-2">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-black text-3xl md:text-6xl font-bold font-poppins capitalize leading-tight">
          Discover the Best Activities <br />at waterways
        </h2>
        <p className="text-zinc-500 text-lg md:text-2xl font-medium font-poppins capitalize mt-8 max-w-3xl mx-auto px-4">
          From thrilling water sports to serene sunset cruises, enjoy handpicked activities that make every moment at sea unforgettable.
        </p>
      </div>

      {/* Activities Masonry Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto px-4">
        {activities.map((item, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-[32px] mb-6 break-inside-avoid ${item.height} group`}
          >
            {/* الصورة */}
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover rounded-[32px] transition-transform duration-500 group-hover:scale-105"
              quality={85}
            />

            {/* الأوفرلاي الأسود الافتراضي */}
            <div className="absolute inset-0 bg-black/20 transition duration-500 group-hover:bg-transparent"></div>

            {/* العنوان */}
            <div
  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center px-2"
>
  <span className="text-white text-2xl sm:text-xl font-medium font-poppins capitalize whitespace-nowrap">
    {item.title}
  </span>
</div>

          </div>
        ))}
      </div>
      <div className="text-center mb-8 sm:mb-16 mt-12 sm:mt-16 px-4">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-signpainter text-[#927C4E] mb-2 sm:mb-4">
          Where To Sail Now
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#093B77] sm:text-black font-poppins mb-4 sm:mb-6">
          Top Destination
          </h2>
          
          {/* Golden Wavy Line - Mobile Only */}
          <div className="flex justify-center sm:hidden">
            <Image 
              src="/icons/Line 74.svg" 
              alt="Decorative line"
              width={200}
              height={12}
              className="h-3"
            />
          </div>
        </div>
    </section>
  );
};

export default Activities;
