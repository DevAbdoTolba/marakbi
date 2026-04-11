"use client";

import Image from 'next/image';

export default function AboutLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* What We Aim Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black font-poppins">
            What We Aim
          </h2>
        </div>

          <div className="grid grid-cols-2 gap-12 items-center mt-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 relative h-64">
              <Image
                src="/images/f1.webp"
                alt="Sunset boat"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-12 relative h-64">
              <Image
                src="/images/f2.webp"
                alt="Sunset boat close"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="col-span-2 relative h-72">
              <Image
                src="/images/f3.webp"
                alt="Sailboat on Nile"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-lg leading-relaxed text-gray-700 font-poppins">
                <span className="font-bold text-black">
                  Marakbi is dedicated to making boat trips easy for everyone.
                </span>{" "}
                We believe that every person—whether you are booking your first
                boat or you&apos;re an experienced sailor—should have no trouble
                finding the perfect ride.
              </p>
            </div>

            <div>
              <p className="text-lg leading-relaxed text-gray-700 font-poppins">
                <span className="font-bold text-black">
                  Our main focus is making it fast to book a boat anywhere you
                  need one.
                </span>
                We are always improving our service and listing new boats. Most
                importantly, we have strong rules to make sure every trip is
                safe and respects the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-4 font-poppins">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins">
              To connect travelers with unforgettable water experiences while
              promoting sustainable tourism and preserving Egypt&apos;s
              magnificent maritime heritage.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#0C4A8C] rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black font-poppins">
                Quality Assurance
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                Every boat and captain on our platform is thoroughly vetted to
                ensure the highest standards of safety and service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#0C4A8C] rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black font-poppins">
                Best Value
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                Transparent pricing with no hidden fees. We help you find the
                perfect boat within your budget.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#0C4A8C] rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black font-poppins">
                Eco-Friendly
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                Committed to sustainable practices that protect Egypt&apos;s
                waterways for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-4 font-poppins">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins">
            Born from a passion for Egypt&apos;s waterways and a vision to make
            boat travel accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4 font-poppins">
                Founded in 2024
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                Marakbi was born from a simple idea: making Egypt&apos;s
                beautiful waterways accessible to everyone. Our founders,
                experienced sailors and travel enthusiasts, noticed that booking
                a boat trip was unnecessarily complicated and expensive.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4 font-poppins">
                Growing Community
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                Today, we&apos;re proud to connect thousands of travelers with
                local boat owners across Egypt. From the majestic Nile to the
                Red Sea, we&apos;ve made it easy to discover Egypt&apos;s
                waterways while supporting local communities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48">
                <Image
                  src="/images/Rectangle 3463860.webp"
                  alt="Nile cruise"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="relative h-32">
                <Image
                  src="/images/Rectangle 3463861.webp"
                  alt="Boat adventure"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-32">
                <Image
                  src="/images/Rectangle 3463862.webp"
                  alt="Sunset sailing"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="relative h-48">
                <Image
                  src="/images/Rectangle 3463863.webp"
                  alt="Family trip"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <div className="bg-[#0C4A8C] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 font-poppins">
              Our Values
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-poppins">
              The principles that guide everything we do at Marakbi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#0C4A8C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-poppins">
                Passion
              </h3>
              <p className="text-blue-100 leading-relaxed font-poppins">
                We love what we do and it shows in every interaction with our
                community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#0C4A8C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-poppins">
                Trust
              </h3>
              <p className="text-blue-100 leading-relaxed font-poppins">
                Building lasting relationships through transparency and
                reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#0C4A8C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-poppins">
                Innovation
              </h3>
              <p className="text-blue-100 leading-relaxed font-poppins">
                Continuously improving our platform to serve you better.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#0C4A8C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-poppins">
                Community
              </h3>
              <p className="text-blue-100 leading-relaxed font-poppins">
                Supporting local boat owners and creating meaningful
                connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-4 font-poppins">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins">
            The passionate people behind Marakbi, dedicated to making your water
            adventures unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500 font-poppins">
                AH
              </span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
              Ahmed Hassan
            </h3>
            <p className="text-[#0C4A8C] font-semibold mb-4 font-poppins">
              Founder & CEO
            </p>
            <p className="text-gray-600 leading-relaxed font-poppins">
              Former naval officer with 15 years of experience on Egypt&apos;s
              waterways. Passionate about making boat travel accessible to
              everyone.
            </p>
          </div>

          <div className="text-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500 font-poppins">
                SM
              </span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
              Sarah Mohamed
            </h3>
            <p className="text-[#0C4A8C] font-semibold mb-4 font-poppins">
              Head of Operations
            </p>
            <p className="text-gray-600 leading-relaxed font-poppins">
              Tourism industry veteran with expertise in customer experience and
              sustainable travel practices across Egypt.
            </p>
          </div>

          <div className="text-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500 font-poppins">
                MK
              </span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
              Mohamed Khalil
            </h3>
            <p className="text-[#0C4A8C] font-semibold mb-4 font-poppins">
              Technology Director
            </p>
            <p className="text-gray-600 leading-relaxed font-poppins">
              Tech innovator focused on creating seamless booking experiences
              and connecting travelers with the perfect boat.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#0C4A8C] to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold text-white mb-6 font-poppins">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed font-poppins">
            Join thousands of travelers who have discovered Egypt&apos;s
            waterways with Marakbi. Your perfect boat trip is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0C4A8C] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors font-poppins">
              Explore Boats
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#0C4A8C] transition-colors font-poppins">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
