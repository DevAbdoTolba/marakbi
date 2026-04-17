import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="min-h-screen bg-white ">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="privacy-page-title mb-3 mt-8">Privacy Policy</h1>
            <p className="privacy-last-updated">Last updated: [October 2025]</p>
          </div>

          {/* Main Content - All in Gray Background */}
          <div className="bg-gray-100 pt-16 px-24 pb-24 rounded-lg">
            {/* Empty space under Privacy Policy */}
            <div className="mb-8"></div>

            {/* Inner Container - Smaller width */}
            <div className="max-w-4xl">
              {/* Main Heading */}
              <div className="mb-16">
                <h2 className="privacy-main-heading">
                  Sail Your Journey with Marakbi — Egypt&apos;s Leading Boat
                  Booking Platform
                </h2>
              </div>

              {/* Policy Content */}
              <div className="space-y-12">
                {/* Section 1 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    1. Information We Collect
                  </h3>
                  <p className="privacy-section-text mb-4">
                    When you use Marakbi&apos;s platform, we may collect:
                  </p>
                  <ul className="list-disc list-inside space-y-3 ml-6">
                    <li className="privacy-section-text">
                      Personal details such as your name, email, and phone
                      number.
                    </li>
                    <li className="privacy-section-text">
                      Booking details including the type of boat, service, and
                      travel dates.
                    </li>
                    <li className="privacy-section-text">
                      Payment information processed securely through trusted
                      providers.
                    </li>
                    <li className="privacy-section-text">
                      Location data to connect you with nearby captains and
                      boats.
                    </li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    2. How We Use Your Information
                  </h3>
                  <p className="privacy-section-text mb-4">
                    We use your data to:
                  </p>
                  <ul className="list-disc list-inside space-y-3 ml-6">
                    <li className="privacy-section-text">
                      Process and confirm your bookings.
                    </li>
                    <li className="privacy-section-text">
                      Connect you with local captains and service providers.
                    </li>
                    <li className="privacy-section-text">
                      Enhance your experience by tailoring services to your
                      preferences.
                    </li>
                    <li className="privacy-section-text">
                      Ensure safety, security, and fraud prevention.
                    </li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    3. Data Sharing
                  </h3>
                  <ul className="list-disc list-inside space-y-3 ml-6">
                    <li className="privacy-section-text">
                      We do not sell or trade your personal information.
                    </li>
                    <li className="privacy-section-text">
                      Limited data is shared only with verified boat owners or
                      service providers to complete your booking.
                    </li>
                    <li className="privacy-section-text">
                      We may share information when required by law or to
                      protect the safety of our users.
                    </li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    4. Data Security
                  </h3>
                  <p className="privacy-section-text">
                    Your information is encrypted and stored securely. We
                    continuously update our systems to protect against
                    unauthorized access, misuse, or loss.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    5. Your Rights
                  </h3>
                  <p className="privacy-section-text mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-3 ml-6">
                    <li className="privacy-section-text">
                      Access, update, or delete your personal data.
                    </li>
                    <li className="privacy-section-text">
                      Opt-out of marketing communications at any time.
                    </li>
                    <li className="privacy-section-text">
                      Contact our support team for any privacy-related concerns.
                    </li>
                  </ul>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="privacy-section-heading mb-4">
                    6. Updates to this Policy
                  </h3>
                  <p className="privacy-section-text">
                    We may update this Privacy Policy from time to time. Any
                    changes will be communicated on our website with the updated
                    date clearly shown.
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
