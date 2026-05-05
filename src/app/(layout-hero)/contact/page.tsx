"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { validateEmail, validateEgyptianPhone, VALIDATION_MESSAGES } from "@/lib/validation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});

  // إخفاء الـ notification بعد 5 ثواني
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error on change
    if (name === 'email' || name === 'phone') {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    const errors: { email?: string; phone?: string } = {};
    if (!validateEmail(formData.email)) {
      errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
    }
    if (formData.phone && !validateEgyptianPhone(formData.phone)) {
      errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // إرسال البيانات للـ API
      const { BASE_URL } = await import('@/lib/api');
      const response = await fetch(
        `${BASE_URL}/contact/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.firstName,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // نجح الإرسال
      setSubmitStatus({
        type: "success",
        message: "Your message has been sent successfully! We'll get back to you soon.",
      });
      setShowNotification(true);

      // مسح الفورم
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
      setShowNotification(true);
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notification Toast */}
      {showNotification && submitStatus.type && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div
            className={`flex items-center gap-3 min-w-[350px] max-w-md p-4 rounded-lg shadow-2xl border-2 ${submitStatus.type === "success"
                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-400"
                : "bg-gradient-to-r from-red-50 to-red-100 border-red-400"
              }`}
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${submitStatus.type === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
                }`}
            >
              {submitStatus.type === "success" ? (
                <svg
                  className="w-6 h-6 text-white"
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
              ) : (
                <svg
                  className="w-6 h-6 text-white"
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
              )}
            </div>

            {/* Message */}
            <div className="flex-1">
              <h3
                className={`font-poppins font-semibold text-base mb-1 ${submitStatus.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                  }`}
              >
                {submitStatus.type === "success" ? "Success!" : "Error!"}
              </h3>
              <p
                className={`font-poppins text-sm ${submitStatus.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                  }`}
              >
                {submitStatus.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowNotification(false);
                setSubmitStatus({ type: null, message: "" });
              }}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${submitStatus.type === "success"
                  ? "hover:bg-green-200 text-green-600"
                  : "hover:bg-red-200 text-red-600"
                }`}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[869px_auto] gap-8 lg:gap-8 xl:gap-12 justify-items-start">
            {/* Left Column - Contact Form */}
            <div className="border border-[#cacaca] rounded-lg p-4 sm:p-6 md:p-8 lg:p-11 h-fit w-full">
              {/* Form Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-poppins font-medium capitalize text-black mb-4 leading-[normal]">
                Contact Form
              </h2>

              {/* Form Description */}
              <p className="text-base sm:text-lg lg:text-[22px] font-poppins font-normal capitalize text-[#616161] mb-8 max-w-[636px] leading-[normal]">
                Ready to reserve your unforgettable water adventure?
                <br />
                Fill out the details below and secure your perfect Daffa
                experience in just a few clicks
              </p>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* First Row - First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full h-[60px] px-4 py-3 bg-[#f7f7f7] rounded-lg border-none outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full h-[60px] px-4 py-3 bg-[#f7f7f7] rounded-lg border-none outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Second Row - Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`w-full h-[60px] px-4 py-3 bg-[#f7f7f7] rounded-lg border outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all ${fieldErrors.email ? 'border-red-500' : 'border-transparent'}`}
                      required
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600 font-poppins">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone (e.g. 01012345678)"
                      className={`w-full h-[60px] px-4 py-3 bg-[#f7f7f7] rounded-lg border outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all ${fieldErrors.phone ? 'border-red-500' : 'border-transparent'}`}
                      required
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 font-poppins">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full h-[60px] px-4 py-3 bg-[#f7f7f7] rounded-lg border-none outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={6}
                    className="w-full min-h-[228px] px-4 py-6 bg-[#f7f7f7] rounded-lg border-none outline-none text-[22px] font-poppins font-normal text-black placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-[#093b77] focus:ring-opacity-20 transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-4 font-poppins font-medium text-base rounded-lg transition-colors mt-6 ${isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-300 text-black hover:bg-amber-300"
                    }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Right Column - Contact Information Cards */}
            <div className="flex flex-col gap-6 max-w-[427px] w-full lg:justify-start">
              {/* Contact Information Card */}
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-poppins font-normal text-neutral-950 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex gap-3 items-start pb-4">
                    <div className="bg-[rgba(3,2,19,0.1)] rounded-[10px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/icons/contact-1.svg"
                        alt="Phone"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-poppins font-normal text-[#717182] mb-1 leading-[20px]">
                        Phone
                      </p>
                      <p className="text-base font-poppins font-medium text-neutral-950 mb-1 leading-[24px]">
                        +2010 31 41 6 900
                      </p>
                      <p className="text-xs font-poppins font-normal text-[#717182] leading-[16px]">
                        Mon-Fri 8AM-8PM EST
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.1)]" />

                  {/* Email */}
                  <div className="flex gap-3 items-start pb-4">
                    <div className="bg-[rgba(3,2,19,0.1)] rounded-[10px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/icons/contact-2.svg"
                        alt="Email"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-poppins font-normal text-[#717182] mb-1 leading-[20px]">
                        Email
                      </p>
                      <p className="text-base font-poppins font-medium text-neutral-950 mb-1 leading-[24px]">
                        info@daffa.pro
                      </p>
                      <p className="text-xs font-poppins font-normal text-[#717182] leading-[16px]">
                        We&apos;ll respond within 24hrs
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.1)]" />

                  {/* Office */}
                  <div className="flex gap-3 items-start pb-4">
                    <div className="bg-[rgba(3,2,19,0.1)] rounded-[10px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/icons/contact-3.svg"
                        alt="Location"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-poppins font-normal text-[#717182] mb-1 leading-[20px]">
                        Office
                      </p>
                      <p className="text-base font-poppins font-medium text-neutral-950 mb-1 leading-[24px]">
                        Aswan - Egypt
                      </p>
                      <p className="text-xs font-poppins font-normal text-[#717182] leading-[16px]">
                        Visit us at our location
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.1)]" />

                  {/* Business Hours */}
                  <div className="flex gap-3 items-start">
                    <div className="bg-[rgba(3,2,19,0.1)] rounded-[10px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/icons/contact-4.svg"
                        alt="Location"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-poppins font-normal text-[#717182] mb-1 leading-[20px]">
                        Business Hours
                      </p>
                      <p className="text-base font-poppins font-medium text-neutral-950 mb-1 leading-[24px]">
                        Monday - Friday
                      </p>
                      <p className="text-xs font-poppins font-normal text-[#717182] leading-[16px]">
                        8:00 AM - 8:00 PM EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us Card */}
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-poppins font-medium text-neutral-950 mb-2">
                  Follow Us
                </h3>
                <p className="text-base font-poppins font-normal text-[#717182] mb-4">
                  Stay connected on social media
                </p>
                <div className="flex gap-3">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61578325940602"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/icons/cs-1.svg"
                      alt="Facebook"
                      width={16}
                      height={16}
                    />
                  </Link>
                  <Link
                    href="https://www.instagram.com/daffa_app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/icons/cs-2.svg"
                      alt="Instagram"
                      width={16}
                      height={16}
                    />
                  </Link>

                  <Link
                    href="https://www.x.com/daffa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/icons/cs-3.svg"
                      alt="Twitter"
                      width={16}
                      height={16}
                    />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/daffa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/icons/cs-4.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                    />
                  </Link>
                </div>
              </div>

              {/* Need Immediate Help Card */}
              <div className="bg-[#030213] border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-poppins font-normal text-white mb-3">
                  Need Immediate Help?
                </h3>
                <p className="text-sm font-poppins font-normal text-white opacity-90 mb-4">
                  Call our support team for urgent assistance with your booking
                  or rental.
                </p>
                <Link
                  href="tel:+201031416900"
                  className="w-full bg-[#eceef2] h-9 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d0d4da] transition-colors"
                >
                  <Image
                    src="/icons/contact-1.svg"
                    alt="Phone"
                    width={16}
                    height={16}
                    className="opacity-80"
                  />
                  <span className="text-sm font-poppins font-medium text-[#030213]">
                    Call Now
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
