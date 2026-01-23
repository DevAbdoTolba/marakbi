"use client";

import React, { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import useFormStep from "@/hooks/useFormStep";

export default function StepTwoPersonalInfo() {
  const { setStep } = useFormStep();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await customerApi.getProfile();
        if (response.success && response.data) {
          setBio(response.data.bio || "");
          setPhone(response.data.phone || "");
          setAddress(response.data.address || "");
          setHasProfile(true);
        }
      } catch {
        console.log("No profile found, creating new one");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleContinue = async () => {
    setError("");
    
    // Validation
    if (!phone || !address) {
      setError("Phone and Address are required");
      return;
    }

    try {
      setSaving(true);
      const profileData = { bio, phone, address };
      
      const response = hasProfile
        ? await customerApi.updateProfile(profileData)
        : await customerApi.createProfile(profileData);

      if (response.success) {
        setStep(3);
      } else {
        setError(response.error || "Failed to save profile");
      }
    } catch {
      setError("An error occurred while saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 font-poppins">Personal Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (Optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
            required
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-sky-900 text-white rounded-lg hover:bg-sky-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}
