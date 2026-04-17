import Footer from "@/components/Footer";

export default function TermsConditionsPage() {
  return (
    <>
      <div className="min-h-screen bg-white ">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="privacy-page-title mb-3 mt-8">Terms & Conditions</h1>
            <p className="privacy-last-updated">Last updated: [October 2025]</p>
          </div>

          {/* Main Content - All in Gray Background */}
          <div className="bg-gray-100 pt-16 px-24 pb-24 rounded-lg">
            {/* Empty space under Terms & Conditions */}
            <div className="mb-8"></div>

            {/* Inner Container - Smaller width */}
            <div className="max-w-4xl">
              {/* Main Heading */}
              <div className="mb-16">
                <h2
                  className="text-4xl font-semibold text-gray-900 mb-6 font-poppins"
                  style={{ fontWeight: 600 }}
                >
                  Welcome to <span className="text-blue-600">Marakbi</span> –
                  your trusted platform for authentic boating experiences across
                  Egypt.
                </h2>
                <p
                  className="text-2xl text-gray-900 font-poppins"
                  style={{ fontWeight: 600 }}
                >
                  By using our services, you agree to our Terms and Conditions
                  for a safe and enjoyable experience.
                </p>
              </div>

              {/* Terms Content */}
              <div className="space-y-12">
                {/* Section 1 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    1. Introduction
                  </h3>
                  <p className="privacy-section-text">
                    By accessing or using Marakbi&apos;s website or mobile services,
                    you agree to these Terms and Conditions. Our goal is to
                    provide a safe, transparent, and enjoyable experience for
                    everyone using our platform - whether you&apos;re booking a trip,
                    listing your boat, or just exploring.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">2. Our Role</h3>
                  <p className="privacy-section-text">
                    Marakbi acts as a connecting platform between users and
                    verified boat owners or operators across Egypt. We
                    facilitate discovery and booking, but the responsibility for
                    trip details, safety, and service quality lies solely with
                    the boat owners and operators.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    3. User Responsibilities
                  </h3>
                  <p className="privacy-section-text">
                    Users must provide accurate information when creating
                    accounts or making bookings. You agree to follow all
                    applicable local laws, respect others, and use the platform
                    ethically. Any misuse, such as providing false details or
                    engaging in fraudulent or inappropriate behavior, may result
                    in account suspension or removal.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    4. Bookings And Payments
                  </h3>
                  <p className="privacy-section-text">
                    All bookings are subject to availability and confirmation by
                    the boat owner. Payment terms, cancellation policies, and
                    refund eligibility may vary depending on the provider. Users
                    are encouraged to review the specific trip details before
                    completing any booking.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    5. Safety And Conduct
                  </h3>
                  <p className="privacy-section-text">
                    While Marakbi promotes verified and trusted boating
                    experiences, users are responsible for their own safety and
                    behavior during any trip. Please follow the safety
                    instructions provided by the boat operator and comply with
                    local maritime regulations.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    6. Platform Modifications
                  </h3>
                  <p className="privacy-section-text">
                    Marakbi reserves the right to modify, suspend, or update the
                    platform, its content, or these Terms and Conditions at any
                    time without prior notice. Continued use of our services
                    after any updates implies your acceptance of the revised
                    terms.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    7. Limitation Of Liability
                  </h3>
                  <p className="privacy-section-text">
                    Marakbi is not liable for any accidents, losses, or disputes
                    arising between users and boat operators. Our role is
                    limited to facilitating connections and bookings between
                    both parties.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    8. Contact Us
                  </h3>
                  <p className="privacy-section-text">
                    For any inquiries, clarifications, or support requests
                    related to these Terms and Conditions, please contact our
                    team through our official channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
