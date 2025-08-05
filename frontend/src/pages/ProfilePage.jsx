import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      const formattedData = {
        ...data,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill)
          : [],
      };
      const result = await updateProfile(formattedData);
      if (result.success) setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
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
    reset();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors({});
    const errors = {};
    if (!passwordForm.currentPassword)
      errors.currentPassword = "Current password is required";
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
          headers: { Authorization: `Bearer ${token}` },
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
      if (error.response?.data) {
        setPasswordErrors({ server: error.response.data.message });
      } else {
        setPasswordErrors({ server: "Failed to change password" });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-indigo-600" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-sm opacity-90 capitalize">{user?.role}</p>
                {user?.role === "alumni" && user?.graduationYear && (
                  <p className="text-sm opacity-80">
                    Class of {user.graduationYear}
                  </p>
                )}
                {user?.major && (
                  <p className="text-sm opacity-80">{user.major}</p>
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-white text-indigo-600 border border-white px-4 py-2 rounded-md hover:bg-indigo-50 transition"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    className="form-input"
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Experience Level</label>
                  <select {...register("experience")} className="form-input">
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Bio</label>
                <textarea
                  {...register("bio", {
                    maxLength: {
                      value: 500,
                      message: "Bio cannot exceed 500 characters",
                    },
                  })}
                  className="form-input"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="form-error">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Skills</label>
                <input
                  {...register("skills")}
                  className="form-input"
                  placeholder="JavaScript, React, Node.js"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate skills with commas
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Current Position</label>
                  <input
                    {...register("currentPosition")}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Company</label>
                  <input {...register("company")} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">LinkedIn Profile</label>
                <input
                  {...register("linkedinProfile", {
                    pattern: {
                      value:
                        /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
                      message: "Enter a valid LinkedIn profile URL",
                    },
                  })}
                  type="url"
                  className="form-input"
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
                {errors.linkedinProfile && (
                  <p className="form-error">{errors.linkedinProfile.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="loader mr-2"></span>Updating...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="section-title">About</h2>
                <p className="text-gray-700">
                  {user?.bio || "No bio provided yet."}
                </p>
              </section>

              <section>
                <h2 className="section-title">Professional Information</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="font-medium">Experience Level</p>
                    <p>{user?.experience || "Not specified"}</p>
                  </div>
                  {user?.currentPosition && (
                    <div>
                      <p className="font-medium">Current Position</p>
                      <p>{user.currentPosition}</p>
                    </div>
                  )}
                  {user?.company && (
                    <div>
                      <p className="font-medium">Company</p>
                      <p>{user.company}</p>
                    </div>
                  )}
                  {user?.linkedinProfile && (
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <a
                        href={user.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {user?.skills?.length > 0 && (
                <section>
                  <h2 className="section-title">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="section-title">Account Information</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="pt-10 border-t border-gray-300 mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  🔐 Change Password
                </h2>

                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-6 max-w-xl"
                >
                  {/* Server error */}
                  {passwordErrors.server && (
                    <p className="text-red-600 text-sm font-medium">
                      {passwordErrors.server}
                    </p>
                  )}

                  {/* Success message */}
                  {passwordSuccess && (
                    <p className="text-green-600 text-sm font-medium">
                      ✅ Password changed successfully!
                    </p>
                  )}

                  {[
                    { name: "currentPassword", label: "Current Password" },
                    { name: "newPassword", label: "New Password" },
                    { name: "confirmPassword", label: "Confirm New Password" },
                  ].map(({ name, label }, idx) => (
                    <div key={idx} className="space-y-1">
                      <label
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {label}
                      </label>
                      <input
                        id={name}
                        type="password"
                        value={passwordForm[name]}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            [name]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                      {passwordErrors[name] && (
                        <p className="text-red-500 text-sm">
                          {passwordErrors[name]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="relative inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-60 transition duration-200"
                    >
                      {passwordLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
