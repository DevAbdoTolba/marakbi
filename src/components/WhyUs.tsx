"use client"

const WhyUs = () => {
  const features = [
    {
      title: "Unmatched Local Expertise",
      description: "We aren&apos;t just a rental service; we are a network of local professionals who live and breathe Egypt&apos;s waters. Our captains know the hidden gems and secret spots that will make your trip unforgettable.",
      icon: "🎯"
    },
    {
      title: "Your Safety, Our Priority",
      description: "Safety is paramount in everything we do. Our vessels undergo rigorous maintenance and our captains are certified professionals with years of experience navigating Egypt&apos;s waters.",
      icon: "🛡️"
    },
    {
      title: "The Full Scope of Egypt&apos;s Waters",
      description: "From the majestic Nile River to the crystal-clear Red Sea, we offer access to Egypt&apos;s most spectacular aquatic destinations and hidden coastal treasures.",
      icon: "🌊"
    },
    {
      title: "Effortless & Transparent Booking",
      description: "Our streamlined booking process ensures transparency at every step. No hidden fees, clear pricing, and instant confirmations for your peace of mind.",
      icon: "📋"
    }
  ];

  return (
    <section className="w-full bg-sky-900/95 overflow-hidden py-16">

      {/* Content */}
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-poppins capitalize mb-4">
            Why Choosing US
          </h2>
          <p className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-normal font-poppins capitalize mb-8">
            We Do Our Best For Your Convenience
          </p>
          <button className="w-full sm:w-56 h-12 px-6 py-2.5 bg-orange-300 rounded-lg text-sky-900 text-base font-normal font-poppins capitalize hover:bg-orange-400 transition-colors">
            book with us
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-sky-950/50 backdrop-blur-sm rounded-lg p-6 border border-sky-100/20 hover:bg-sky-950/70 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white text-xl font-semibold font-poppins capitalize mb-4">
                {feature.title}
              </h3>
              <p className="text-orange-300 text-base font-normal font-poppins leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;