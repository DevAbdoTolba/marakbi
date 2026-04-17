import Image from 'next/image';

const FeaturedServices = () => {
  const services = [
    {
      icon: '/icons/Frame 42.svg', // Private Boat icon
      title: 'Private Boat',
      description: 'Rent your own exclusive boat for a completely personalized journey with family and friends.'
    },
    {
      icon: '/icons/Frame 37.svg', // Sharing Boat icon
      title: 'Sharing Boat',
      description: 'Join a social, guided trip and split the cost. The perfect way to meet new people and explore together.'
    },
    {
      icon: '/icons/boat-helm-svgrepo-com 1.svg', // Travel Boat icon
      title: 'Travel Boat',
      description: 'Find a unique floating home. Book a houseboat or yacht for an unforgettable overnight stay on the water.'
    },
    {
      icon: '/icons/Frame 1321316342.svg', // Fishing Boat icon
      title: 'Fishing Boat',
      description: 'Get out and catch more. Our boats are fully equipped with everything a dedicated angler needs.'
    },
    {
      icon: '/icons/Gift.svg', // Occasion icon
      title: 'Occassion',
      description: 'Make your event truly special. Host a birthday, party, or celebration on a stunning boat.'
    },
    {
      icon: '/icons/Wakeboarding.svg', // Water activities icon
      title: 'Water activities',
      description: 'Get your adrenaline fix. Rent a boat for all your favorite water sports, from wakeboarding to snorkeling.'
    }
  ];

  return (
    <section className="relative py-16">

      {/* Service Icons Grid */}
      <div className="w-full flex justify-center pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={56}
                  height={56}
                  className="w-14 h-14"
                />
              </div>
              <h3 className="text-black text-base sm:text-lg md:text-xl font-normal font-['Inter'] capitalize mb-2">
                {service.title}
              </h3>
              <div className="w-14 h-1 bg-orange-300 mb-4"></div>
              <p className="text-sky-950 text-sm font-normal font-['Inter'] capitalize max-w-full sm:max-w-44 leading-9">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;