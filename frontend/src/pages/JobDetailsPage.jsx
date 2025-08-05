import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  BuildingOfficeIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { jobAPI, userAPI, handleAPIError } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJob(id);
      setJob(response.job);

      // Check if user has already applied
      const userApplication = response.job.applications.find(
        app => app.user._id === user.id
      );
      setHasApplied(!!userApplication);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error(handleAPIError(error));
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      await userAPI.applyForJob(id);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      fetchJobDetails(); // Refresh to get updated application count
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(handleAPIError(error));
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isJobOwner = job && job.postedBy._id === user.id;
  const isDeadlinePassed = job && job.applicationDeadline && new Date() > new Date(job.applicationDeadline);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {job.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-blue-500 bg-opacity-50 rounded-lg p-3">
                <p className="text-sm">Posted by</p>
                <p className="font-semibold">{job.postedBy.name}</p>
                <p className="text-xs text-blue-200 capitalize">{job.postedByRole}</p>
                {job.postedBy.graduationYear && (
                  <p className="text-xs text-blue-200">Class of {job.postedBy.graduationYear}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
              </section>

              {job.requirements && job.requirements.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </section>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </section>
              )}

              {job.skills && job.skills.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Application</h3>

                {isJobOwner ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">You posted this job</p>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{job.applications.length} applications</span>
                    </div>
                    <button
                      onClick={() => navigate('/my-jobs')}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Manage Applications
                    </button>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 py-2 px-4 rounded-md mb-3">
                      ✓ Application Submitted
                    </div>
                    <p className="text-sm text-gray-600">
                      You have already applied for this position.
                    </p>
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="text-center">
                    <div className="bg-red-100 text-red-800 py-2 px-4 rounded-md mb-3">
                      Application Deadline Passed
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Interested in this position? Apply now!
                    </p>
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Applying...
                        </div>
                      ) : (
                        'Apply Now'
                      )}
                    </button>
                    {job.applicationLink && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Or apply directly:</p>
                        <a
                          href={job.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm underline"
                        >
                          External Application Link
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="capitalize">{job.experienceLevel}</span>
                  </div>

                  {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span>
                        {job.salaryRange.min && job.salaryRange.max
                          ? `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}`
                          : job.salaryRange.min
                          ? `From $${job.salaryRange.min.toLocaleString()}`
                          : `Up to $${job.salaryRange.max.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span>{formatDate(job.createdAt)}</span>
                  </div>

                  {job.applicationDeadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className={isDeadlinePassed ? 'text-red-600' : ''}>
                        {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Views:</span>
                    <span>{job.views}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <a 
                      href={`mailto:${job.contactEmail}`}
                      className="block text-blue-600 hover:text-blue-700 break-all"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
