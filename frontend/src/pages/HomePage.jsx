import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

import {
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: "For Students",
      description:
        "Find internships, part-time jobs, and entry-level positions posted by fellow students and alumni."
    },
    {
      icon: <BriefcaseIcon className="h-8 w-8" />,
      title: "For Alumni",
      description:
        "Share job opportunities from your company and help current students kickstart their careers."
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "College Community",
      description:
        "Connect with your college network and build meaningful professional relationships."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your College Job Portal
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting students and alumni through exclusive job opportunities within our college community
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back, <span className="font-semibold">{user?.name}</span>!
                Ready to explore new opportunities?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jobs"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 inline-flex items-center justify-center"
                >
                  Browse Jobs
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/create-job"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Our College Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for college students and alumni,
              ensuring you're connected with relevant opportunities and trusted contacts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition duration-200 text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to get started with our job portal
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Register",
              "Choose Role",
              "Explore",
              "Connect"
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{step}</h3>
                <p className="text-gray-600 text-sm">
                  {[
                    "Sign up with your college email address",
                    "Identify as a current student or alumni",
                    "Browse jobs or post opportunities",
                    "Apply for jobs and build your network"
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Join your college community and discover exclusive job opportunities today.
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 inline-flex items-center"
            >
              Create Your Account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
