"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerApi, storage } from "@/lib/api";
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
    username: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      if (!storage.getToken()) {
        console.log("No token found, redirecting to login");
        router.push("/login");
        return;
      }

      const response = await customerApi.getProfile();
      if (response.success && response.data) {
        const profile = response.data;
        const u = profile.user;

        const firstName = u?.first_name || "";
        const lastName = u?.last_name || "";
        const email = u?.email || "";
        const username = u?.username || "";
        const address = profile.address || "";
        const fullName = `${firstName} ${lastName}`.trim() || u?.username || "User";

        setUser({
          id: profile.user_id.toString(),
          fullName,
          email,
          role: "user",
        });

        setFormData({
          firstName,
          lastName,
          username,
          email,
          address,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Fallback to local storage user details if profile endpoint fails
        const storedUser = storage.getUser();
        if (storedUser) {
          setUser({
            id: storedUser.id.toString(),
            fullName: storedUser.username,
            email: storedUser.email || "",
            role: "user",
          });

          setFormData({
            firstName: storedUser.username?.split(" ")[0] || "",
            lastName: storedUser.username?.split(" ").slice(1).join(" ") || "",
            username: storedUser.username || "",
            email: storedUser.email || "",
            address: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to set a new password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }
    }

    try {
      setLoading(true);

      // 1. Update profile details on backend
      const profileResponse = await customerApi.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
      });

      if (!profileResponse.success) {
        setError(profileResponse.error || "Failed to update profile");
        setLoading(false);
        return;
      }

      // 2. Change password if fields are filled
      if (formData.newPassword) {
        const passwordResponse = await customerApi.changePassword({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        });

        if (!passwordResponse.success) {
          setError(passwordResponse.error || "Profile updated, but password change failed");
          setLoading(false);
          return;
        }
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Re-fetch profile to sync state
      await fetchProfile();

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
      username: user?.fullName || "",
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
                    <span className="text-4xl font-bold text-gray-500 font-poppins">
                      {formData.firstName
                        ? formData.firstName.charAt(0).toUpperCase()
                        : (user.fullName?.charAt(0).toUpperCase() || "U")}
                    </span>
                  </div>
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
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                      disabled={true}
                      className="w-full px-4 py-3 rounded-lg font-poppins bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed outline-none"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ""}
                      disabled={true}
                      className="w-full px-4 py-3 rounded-lg font-poppins bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed outline-none"
                      placeholder="Username"
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
                      className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                        className={`w-full px-4 py-3 rounded-lg font-poppins ${isEditing
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
                    className={`px-6 py-3 font-medium font-poppins transition-colors ${isEditing
                        ? "text-gray-700 hover:text-gray-900 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isEditing}
                    className={`px-8 py-3 font-medium rounded-lg transition-colors font-poppins ${isEditing
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
