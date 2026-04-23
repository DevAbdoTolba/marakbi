"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/api";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    id?: string;
    fullName?: string;
    email?: string;
    role?: "user" | "boat_owner" | "admin";
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated
        if (!storage.getToken()) {
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        // Get user from storage first
        const storedUser = storage.getUser();
        if (storedUser) {
          setUser({
            id: storedUser.id.toString(),
            fullName: storedUser.username,
            email: storedUser.email || "",
            role: "user",
          });
        }

        // Profile API is not available on server, use stored user data
        if (storedUser) {
          // Try to load saved profile data from localStorage
          const savedProfile = localStorage.getItem("userProfile");
          let profileData = null;

          if (savedProfile) {
            try {
              profileData = JSON.parse(savedProfile);
            } catch (error) {
              console.error("Error parsing saved profile:", error);
            }
          }

          setFormData({
            firstName:
              profileData?.bio?.split(" ")[0] ||
              storedUser.username?.split(" ")[0] ||
              "",
            lastName:
              profileData?.bio?.split(" ").slice(1).join(" ") ||
              storedUser.username?.split(" ").slice(1).join(" ") ||
              "",
            email: profileData?.phone || storedUser.email || "",
            address: profileData?.address || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }

        // Load profile image from localStorage
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // If profile doesn't exist, we'll create it when user saves
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      // Profile API is not available, save to localStorage
      try {
        // Save profile data to localStorage
        const profileData = {
          bio: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.email, // Using email as phone for now
          address: formData.address,
        };

        localStorage.setItem("userProfile", JSON.stringify(profileData));
        setSuccess("Profile updated successfully!");
      } catch (error) {
        console.error("Error saving profile:", error);
        setError("Failed to save profile. Please try again.");
        return;
      }

      // Update local user data
      const updatedUser = {
        id: user?.id || "1",
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        role: (user?.role as "user" | "boat_owner" | "admin") || "user",
      };

      setUser(updatedUser);

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Exit edit mode after successful save
      setIsEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save profile. Please try again."
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileImage(result);
        // Save to localStorage temporarily
        localStorage.setItem("profileImage", result);
        setSuccess("Profile image updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
    setIsEditing(false);
    // Reset form data
    setFormData((prev) => ({
      ...prev,
      firstName: user?.fullName?.split(" ")[0] || "",
      lastName: user?.fullName?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/images/Rectangle 3463878.webp')" }}
        >
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Navigation */}
          <div className="lg:col-span-1 flex">
            <div className="bg-white py-8 rounded-lg shadow-sm w-full flex flex-col">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold text-gray-900 mb-2 font-poppins">
                  Welcome!
                </h2>
                <p className="text-blue-500 text-5xl font-bold font-poppins">
                  {user.fullName?.split(" ")[0] || "User"}
                </p>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-500 font-poppins">
                        {user.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Edit icon when in edit mode */}
                  {isEditing && (
                    <div className="absolute -bottom-1 -right-1">
                      <label
                        htmlFor="profileImageInput"
                        className="cursor-pointer"
                      >
                        <Image
                          src="/icons/iconamoon_edit-fill.svg"
                          alt="Edit"
                          width={20}
                          height={20}
                          className="w-5 h-5 text-blue-500 drop-shadow-lg"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
                          }}
                        />
                      </label>
                      <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Click to upload when in edit mode */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition-all duration-200 cursor-pointer">
                      <label
                        htmlFor="profileImageInput"
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        <span className="text-white text-sm font-poppins opacity-0 hover:opacity-100 transition-opacity">
                          Click to upload
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div className="text-center mb-6">
                <p className="text-xl font-semibold text-gray-900 font-poppins">
                  {user.fullName || "User Name"}
                </p>
              </div>

              {/* Edit Profile Button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-poppins hover:bg-gray-50 transition-colors"
                >
                  <span className="font-poppins text-base">Edit Profile</span>
                  <Image
                    src="/icons/iconamoon_edit-fill.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </button>
              </div>

              <div className="mt-auto border-t border-gray-200 pt-6">
                <nav className=" space-y-2">
                  <a
                    href="/profile"
                    className="py-5 px-4 block bg-[#0C4A8C] text-white font-medium font-poppins text-base text-left w-full"
                  >
                    Profile
                  </a>
                  <a
                    href="/manage-account"
                    className=" py-5 px-4 block text-gray-600 font-poppins text-base hover:text-[#0C4A8C] transition-colors text-left"
                  >
                    Manage My Account
                  </a>
                  <a
                    href="/payment-options"
                    className=" py-5 px-4 block text-gray-600 font-poppins text-base hover:text-[#0C4A8C] transition-colors text-left"
                  >
                    My Payment Options
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Right Content - Edit Profile Form */}
          <div className="lg:col-span-2 flex">
            <div className="bg-white rounded-lg p-8 shadow-sm w-full flex flex-col">
              <h2 className="text-2xl font-medium text-blue-500 mb-6 font-poppins">
                Edit Your Profile
              </h2>

              <form onSubmit={handleSaveChanges} className="space-y-6 flex-1">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${
                        isEditing
                          ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}
                      placeholder="Address"
                    />
                  </div>
                </div>

                {/* Password Changes Section */}
                <div className="pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">
                    Password Changes
                  </h3>

                  <div className="space-y-4">
                    <div>

                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${
                          isEditing
                            ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                            : "bg-gray-100 border border-gray-200 text-gray-500"
                        }`}
                        placeholder="Current Password"
                      />
                    </div>

                    <div>

                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${
                          isEditing
                            ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                            : "bg-gray-100 border border-gray-200 text-gray-500"
                        }`}
                        placeholder="New Password"
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${
                          isEditing
                            ? "bg-white border border-gray-300 focus:ring-2 focus:ring-[#0C4A8C] focus:border-[#0C4A8C]"
                            : "bg-gray-100 border border-gray-200 text-gray-500"
                        }`}
                        placeholder="Confirm New Password"
                      />
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg font-poppins">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg font-poppins">
                    {success}
                  </div>
                )}

                {/* Action Buttons - Always visible but disabled when not editing */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={!isEditing}
                    className={`px-6 py-3 font-medium font-poppins transition-colors ${
                      isEditing
                        ? "text-gray-700 hover:text-gray-900 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isEditing}
                    className={`px-8 py-3 font-medium rounded-lg transition-colors font-poppins ${
                      isEditing
                        ? "bg-[#0C4A8C] text-white hover:bg-[#0A3D7A] cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
