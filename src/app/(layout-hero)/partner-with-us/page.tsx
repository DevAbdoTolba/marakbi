'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiMessageCircle, FiFileText } from 'react-icons/fi';

export default function ListYourBoatPage() {
    const requirements = [
        { title: 'Full Name', description: 'Your official name as it appears on your ID.', icon: <FiFileText className="w-6 h-6 text-blue-600" /> },
        { title: 'National ID Image', description: 'A clear photo of your National ID card.', icon: <FiCheckCircle className="w-6 h-6 text-green-600" /> },
        { title: 'Phone Number', description: 'A working phone number for communication.', icon: <FiMessageCircle className="w-6 h-6 text-orange-500" /> },
        { title: 'Email Address', description: 'Your active email address for account setup.', icon: <FiMessageCircle className="w-6 h-6 text-purple-600" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#093B77] mb-6 font-poppins">
                        Partner with DAFFA
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                        Join the leading boat rental platform in Egypt. Listings are verified to ensure quality and trust.
                        Please observe the required documents below to start your application.
                    </p>
                </div>

                {/* Requirements Grid */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 border border-gray-100">
                    <div className="bg-[#093B77] px-8 py-6">
                        <h2 className="text-2xl font-semibold text-white">Required Information</h2>
                        <p className="text-blue-100 text-sm mt-1">Please have these ready before contacting our team.</p>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-white rounded-full shadow-sm shrink-0">
                                    {req.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{req.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{req.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-orange-50 px-8 py-6 border-t border-orange-100 flex items-start gap-3">
                        <div className="mt-1">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-700 text-xs font-bold">i</span>
                        </div>
                        <p className="text-sm text-orange-800">
                            <span className="font-semibold">Note:</span> Your application will be reviewed by our admin team manually. We typically respond within 24 hours.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-4">
                    <p className="text-gray-600 font-medium">Ready to send your details?</p>
                    <Link
                        href="https://wa.me/201031416900"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-full text-lg font-bold shadow-lg hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                        <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </span>
                        Contact Us on WhatsApp
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">You will be redirected to WhatsApp to send these documents.</p>
                </div>

            </div>
        </div>
    );
}
