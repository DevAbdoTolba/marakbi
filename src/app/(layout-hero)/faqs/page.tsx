"use client";

import { useState } from "react";
import Image from "next/image";

export default function FAQsPage() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqItems = [
    {
      id: 1,
      question: "What is Marakbi?",
      answer:
        "Marakbi is an online platform that connects you with trusted boat owners and captains across Egypt. Whether you&apos;re looking for a private trip, a shared tour, or a fishing adventure — we make booking easy and secure.",
    },
    {
      id: 2,
      question: "How do I book a boat?",
      answer:
        "Booking is simple! Browse our available boats, select your preferred date and time, and complete the booking process. You'll receive confirmation and all trip details via email.",
    },
    {
      id: 3,
      question: "Can I customize my trip?",
      answer:
        "Yes! Many of our boat owners offer customizable trip options. You can discuss your preferences directly with the captain or boat owner to tailor your experience to your needs.",
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit cards, debit cards, and online payment platforms. All transactions are secure and processed through our encrypted payment system.",
    },
    {
      id: 5,
      question: "Is it safe to book through Marakbi?",
      answer:
        "Absolutely! All boats on our platform are thoroughly verified for safety standards, proper licensing, and quality service. We work only with trusted and experienced captains.",
    },
    {
      id: 6,
      question: "What happens if I need to cancel?",
      answer:
        "Cancellation policies vary by boat owner, but we offer flexible options. Most bookings can be cancelled up to 24 hours before departure with full refund. Check the specific cancellation policy for your chosen boat.",
    },
    {
      id: 7,
      question: "Do you offer group or event packages?",
      answer:
        "Yes! We offer special packages for groups and events. Contact us to discuss your requirements and we&apos;ll help you find the perfect boat and package for your occasion.",
    },
    {
      id: 8,
      question: "How can I contact support?",
      answer:
        "You can reach our support team via email at info@marakbi.tours, phone at +2010 31 41 6 900, or through our contact form. We're here to help with any questions or concerns.",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <>
      {/* Welcome / Hero Section */}
      <section className="bg-white pt-16 md:pt-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 mb-10 pb-10 lg:pb-10 mt-10">

            {/* النص */}
            <div className="max-w-xl space-y-4 relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-poppins font-semibold leading-[1.2] text-[#1a1a1a]">
                Welcome, Let&apos;s Talk About{" "}
                <span className="text-[#0b4c99]">Marakbi</span>
              </h1>
            </div>

            {/* صورة المركب */}
            <div className="flex justify-center lg:justify-end lg:absolute lg:right-[300px] lg:top-0 lg:bottom-0 lg:pointer-events-none">
              <div className="relative 
                w-full 
                sm:w-[75vw] 
                lg:w-[70vw] 
                lg:max-w-[1400px] 
                lg:min-w-[600px] 
                aspect-[16/9] 
                lg:h-full 
                lg:aspect-auto">

                <Image
                  src="/images/Layer 16yaght.webp"
                  alt="Luxury Yacht"
                  fill
                  className="object-contain scale-[2] lg:object-right"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="h-px w-full bg-[#106bd8]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-poppins font-semibold text-[#1a1a1a] leading-[1.2]">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-lg sm:text-xl lg:text-[24px] text-[#1a1a1a] font-poppins leading-[1.2]">
              Let&apos;s Dive Into the World of{" "}
              <span className="text-xl sm:text-2xl lg:text-[32px] text-[#0b4c99]">Marakbi</span>
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-[#106bd8]" />

        <div className="max-w-[1089px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 md:mt-10 space-y-4">
            {faqItems.map((item) => {
              const isOpen = openItem === item.id;

              return (
                <div key={item.id} className="flex flex-col">

                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full px-4 py-3 flex items-center justify-between rounded-t-[6px] ${
                      isOpen
                        ? "bg-white border border-[#106bd8] border-b-0"
                        : "bg-[#f2f2f2] rounded-b-[6px]"
                    } transition-colors duration-200`}
                  >
                    <span
                      className={`text-sm sm:text-base font-medium font-poppins ${
                        isOpen ? "text-[#106bd8]" : "text-[#1a1a1a]"
                      }`}
                    >
                      {item.id}. {item.question}
                    </span>

                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isOpen ? "bg-[#f2f2f2]" : "bg-white"
                      }`}
                    >
                      {isOpen ? (
                        <svg
                          className="w-3 h-3 text-[#1a1a1a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M20 12H4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3 text-[#1a1a1a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="bg-white border border-[#106bd8] border-t-0 rounded-b-[6px] px-4 py-4">
                      <p className="text-xs sm:text-sm text-[#666666] leading-[1.5] font-poppins">
                        {item.answer}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
