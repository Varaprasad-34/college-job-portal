import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({}); // Add this for profile errors
  const [profileSuccess, setProfileSuccess] = useState(false); // Add this for success message
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      skills: user?.skills?.join(", ") || "",
      experience: user?.experience || "",
      currentPosition: user?.currentPosition || "",
      company: user?.company || "",
      linkedinProfile: user?.linkedinProfile || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setProfileErrors({}); // Clear previous errors

      // Convert skills string back to array
      const formattedData = {
        ...data,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill)
          : [],
      };

      // Send to backend
      const response = await axios.put("/api/users/profile", formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        // Update auth context with new user data
        updateProfile(response.data.user);
        setIsEditing(false);
        setProfileSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.data?.errors) {
        // Handle backend validation errors
        const backendErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        setProfileErrors(backendErrors);
      } else if (error.response?.data?.message) {
        // Handle general error message
        setProfileErrors({ general: error.response.data.message });
      } else {
        // Handle network or other errors
        setProfileErrors({ general: "Failed to update profile. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: user?.name || "",
      bio: user?.bio || "",
      skills: user?.skills?.join(", ") || "",
      experience: user?.experience || "",
      currentPosition: user?.currentPosition || "",
      company: user?.company || "",
      linkedinProfile: user?.linkedinProfile || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileErrors({}); // Clear errors when canceling
    reset();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    // Validation
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Password change error:", error);
      if (error.response && error.response.data) {
        setPasswordErrors({ server: error.response.data.message });
      } else {
        setPasswordErrors({ server: "Failed to change password" });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-blue-100 capitalize">{user?.role}</p>
              {user?.role === "alumni" && user?.graduationYear && (
                <p className="text-blue-100">Class of {user.graduationYear}</p>
              )}
              <p className="text-blue-100">{user?.major}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Success Messages */}
          {profileSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Profile updated successfully!
            </div>
          )}

          {/* Error Messages */}
          {profileErrors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {profileErrors.general}
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                  {profileErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    {...register("experience")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {profileErrors.experience && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.experience}</p>
                  )}
                </div>

                {/* Current Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Position
                  </label>
                  <input
                    {...register("currentPosition")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer"
                  />
                  {profileErrors.currentPosition && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.currentPosition}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Tech Corp"
                  />
                  {profileErrors.company && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.company}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  {...register("bio", {
                    maxLength: {
                      value: 500,
                      message: "Bio cannot exceed 500 characters",
                    },
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                )}
                {profileErrors.bio && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.bio}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  {...register("skills")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                {profileErrors.skills && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.skills}</p>
                )}
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  {...register("linkedinProfile")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
                {profileErrors.linkedinProfile && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.linkedinProfile}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Display Mode */
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    <p className="text-gray-600">{user?.bio || "No bio provided yet."}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900">Experience</h4>
                      <p className="text-gray-600">{user?.experience || "Not specified"}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Position</h4>
                      <p className="text-gray-600">{user.currentPosition}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Company</h4>
                      <p className="text-gray-600">{user.company}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  {user?.skills && user.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900">Member Since</h4>
                    <p className="text-gray-600">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Password Change Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                Password changed successfully!
              </div>
            )}

            {passwordErrors.server && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {passwordErrors.server}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;