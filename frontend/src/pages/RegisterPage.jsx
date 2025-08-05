import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const watchRole = watch("role");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/jobs");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate("/jobs");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 sm:p-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">Join your college community</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a
              </label>
              <select
                {...register("role", { required: "Please select your role" })}
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              >
                <option value="">Select your role</option>
                <option value="student">Current Student</option>
                <option value="alumni">Alumni</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                College Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  validate: (value) =>
                    watchRole === "student"
                      ? value.endsWith("@cmrec.ac.in") || "Students must use @cmrec.ac.in email"
                      : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                        "Invalid email address",
                })}
                type="email"
                autoComplete="email"
                placeholder={
                  watchRole === "student"
                    ? "e.g., yourname@cmrec.ac.in"
                    : "e.g., yourname@example.com"
                }
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              <p className="mt-1 text-xs text-gray-500">
                {watchRole === "student"
                  ? "Students must use an official @cmrec.ac.in email address"
                  : "Any valid email address is accepted for alumni"}
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 pr-10 border rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Graduation Year (Alumni only) */}
            {watchRole === "alumni" && (
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                  Graduation Year
                </label>
                <select
                  {...register("graduationYear", {
                    required: watchRole === "alumni"
                      ? "Graduation year is required for alumni"
                      : false,
                  })}
                  className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                >
                  <option value="">Select graduation year</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.graduationYear.message}
                  </p>
                )}
              </div>
            )}

            {/* Major */}
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Major/Field of Study
              </label>
              <input
                {...register("major", {
                  required: "Major is required",
                })}
                type="text"
                placeholder="e.g., Computer Science, Business Administration"
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              />
              {errors.major && (
                <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio (Optional)
              </label>
              <textarea
                {...register("bio", {
                  maxLength: {
                    value: 500,
                    message: "Bio cannot exceed 500 characters",
                  },
                })}
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
