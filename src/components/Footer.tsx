"use client";

import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  // Handle navigation with reset
  const handleServiceClick = (categoryId: number | null) => {
    // Always reset and navigate to boat-listing with only the category_id (if provided)
    if (categoryId) {
      router.push(`/boat-listing?category_id=${categoryId}`);
    } else {
      router.push('/boat-listing');
    }
  };

  // Service to Category ID mapping
  // Based on API: 1=Motor Boat, 2=Felucca, 3=Fishing, 4=Occasion, 37=Sharing, 38=Water Activities, 39=Travel
  // null = no filter (all boats), undefined = disabled
  const serviceCategoryMap: Record<string, number | null | undefined> = {
    "Boat Rentals": null, // All boats (no category filter)
    "Water Sports": 38, // Water Activities → category_id=38
    "Family activities": null, // All boats (Fishing + Water Activities - handled by showing all)
    "Corporate Events": undefined, // Disabled
    "Fishing Trips": 3, // Fishing → category_id=3
    "Occassions": 4, // Occasion → category_id=4
    "Occasions": 4, // Occasion → category_id=4
    "Travel Boat": 39, // Travel → category_id=39
    "Dahabya": undefined, // Disabled
  };
  return (
    <footer className="text-white bg-gradient-to-t from-[#083872] via-[#0A4489] to-[#106BD8]">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-12 md:pt-16 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-12 lg:gap-16">
          {/* Column 1: Logo and Description */}
          <div className="space-y-4 md:col-span-3 md:pr-4 lg:pr-6">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Logo variant="white" width={64} height={80} />
              </Link>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-6 md:leading-7 font-poppins">
              <span>Daffa is your premier digital gateway to</span><br />
              <span>effortless boat rentals across Egypt&apos;s</span><br />
              <span>majestic Nile and vibrant Red Sea. We</span><br />
              <span>connect you with a diverse fleet, from</span><br />
              <span>authentic feluccas to luxury yachts,</span><br />
              <span>blending local expertise with cutting-edge</span><br />
              <span>technology for your unforgettable aquatic</span><br />
              <span>adventure.</span>
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="md:col-span-2">
            <h4 className="text-lg md:text-xl text-amber-300 font-semibold mb-4 md:mb-6 font-poppins">Daffa Services</h4>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base list-disc list-inside">
              <li>
                {serviceCategoryMap["Boat Rentals"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Boat Rentals"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Boat Rentals
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Boat Rentals</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Water Sports"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Water Sports"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Water Sports
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Water Sports</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Family activities"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Family activities"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Family activities
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Family activities</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Corporate Events"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Corporate Events"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Corporate Events
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Corporate Events</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Fishing Trips"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Fishing Trips"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Fishing Trips
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Fishing Trips</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Occassions"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Occassions"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Occassions
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Occassions</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Travel Boat"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Travel Boat"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Travel Boat
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Travel Boat</span>
                )}
              </li>
              <li>
                {serviceCategoryMap["Dahabya"] !== undefined ? (
                  <button
                    onClick={() => handleServiceClick(serviceCategoryMap["Dahabya"] || null)}
                    className=" hover:text-orange-300 transition-colors font-poppins text-left"
                  >
                    Dahabya
                  </button>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed font-poppins">Dahabya</span>
                )}
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="md:col-span-2">
            <h4 className="text-lg md:text-xl text-amber-300 font-semibold mb-4 md:mb-6 font-poppins">Useful Links</h4>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base list-disc list-inside">
              <li>
                <Link href="our-team" className=" hover:text-orange-300 transition-colors font-poppins">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="our-team" className=" hover:text-orange-300 transition-colors font-poppins">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="boat-listing" className=" hover:text-orange-300 transition-colors font-poppins">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/faqs" className=" hover:text-orange-300 transition-colors font-poppins">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="contact" className=" hover:text-orange-300 transition-colors font-poppins">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div className="md:col-span-3">
            <h4 className="text-lg md:text-xl text-amber-300 font-semibold mb-4 md:mb-6 font-poppins">Subscribe</h4>
            <p className="text-gray-300 text-sm md:text-base font-poppins mb-6">If you want to stay updated and receive regular information subscribing is a great option.</p>
            <p className="text-gray-300 mb-3 text-sm md:text-base font-poppins">Email Newsletter</p>
            <div className="flex items-stretch w-full rounded-lg md:rounded-xl overflow-hidden shadow-sm">
              <div className="relative bg-white/90 flex-[7]">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full h-12 md:h-14 pl-3 md:pl-4 pr-8 md:pr-10 bg-transparent text-[#093B77] placeholder-gray-500 focus:outline-none text-sm md:text-base font-poppins"
                />
                <span className="pointer-events-none absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <div className="w-px bg-[#0E5AA3]" />
              <button className="h-12 md:h-14 px-4 md:px-6 bg-[#CEAF6E] text-[#093B77] font-semibold text-sm md:text-base hover:bg-[#d8ba78] transition-colors font-poppins flex-[3]">
                Subscribe
              </button>
            </div>

            {/* Download App Buttons */}
            <div className="mt-4 md:mt-6">
              <h5 className="text-base md:text-lg text-amber-300 font-semibold mb-3 md:mb-4 font-poppins">Download App</h5>
              <div className="flex gap-1 md:gap-2">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.daffa.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-start hover:scale-105 transition-all duration-200"
                  title="Download on Google Play"
                >
                  <Image src="/icons/Google Play.svg" alt="Google Play" width={120} height={40} className="w-28 h-10 md:w-32 md:h-12" />
                </Link>

                <Link
                  href="https://apps.apple.com/app/daffa/id123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-start hover:scale-105 transition-all duration-200"
                  title="Download on App Store"
                >
                  <Image src="/icons/App Store.svg" alt="App Store" width={120} height={40} className="w-28 h-10 md:w-32 md:h-12" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer Bar */}
      <div className="border-t border-gray-400">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 lg:gap-8">
              <div className="flex items-center gap-2">
                <Image src="/icons/phone_in_talk_y.svg" alt="Phone" width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />
                <Link href="tel:+201031416900" className="text-sm md:text-base text-gray-300 font-poppins hover:text-orange-300 transition-colors">
                  +2010 31 41 6 900
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/icons/mail-1.svg" alt="Email" width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />
                <Link href="mailto:info@daffa.pro" className="text-sm md:text-base text-gray-300 font-poppins hover:text-orange-300 transition-colors">
                  info@daffa.pro
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/icons/home_pin.svg" alt="Location" width={20} height={20} className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base text-gray-300 font-poppins">Aswan - Egypt</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="https://www.facebook.com/profile.php?id=61578325940602" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <Image src="/icons/Facebook.svg" alt="Facebook" width={24} height={24} className="w-full h-full" />
              </Link>
              <Link href="https://www.linkedin.com/company/daffa" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <Image src="/icons/Linkedin.svg" alt="LinkedIn" width={24} height={24} className="w-full h-full" />
              </Link>
              <Link href="https://www.instagram.com/marakbi_app/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <Image src="/icons/instgram.svg" alt="Instagram" width={24} height={24} className="w-full h-full" />
              </Link>
              <Link href="https://www.youtube.com/@daffa" target="_blank" rel="noopener noreferrer" className="w-6 h-6 relative overflow-hidden hover:opacity-80 transition-opacity">
                <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} className="w-full h-full" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-400">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs md:text-sm font-poppins text-center md:text-left">
              © 2025 Daffa- Boat rentals. All rights reserved
            </p>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-orange-300 transition-colors font-poppins">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="text-gray-400 hover:text-orange-300 transition-colors font-poppins">
                Terms of Use
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-300 transition-colors font-poppins">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;