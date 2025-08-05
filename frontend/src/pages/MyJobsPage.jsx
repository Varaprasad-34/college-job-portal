import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserGroupIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';
import { userAPI, jobAPI, handleAPIError } from '../utils/api';
import toast from 'react-hot-toast';

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyJobs();
      setJobs(response.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeletingJobId(jobId);
      await jobAPI.deleteJob(jobId);
      toast.success('Job deleted successfully');
      
      // Remove the deleted job from the state
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(handleAPIError(error));
    } finally {
      setDeletingJobId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApplicationStatusCount = (applications, status) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posted Jobs</h1>
          <p className="text-gray-600">Manage your job postings and view applications</p>
        </div>
        <Link
          to="/create-job"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first job opportunity</p>
          <Link
            to="/create-job"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>{job.company}</span>
                      <span>{job.location}</span>
                      <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Posted {formatDate(job.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {job.views} views
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Applications Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Applications ({job.applications.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getApplicationStatusCount(job.applications, 'pending')}
                      </div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getApplicationStatusCount(job.applications, 'reviewed')}
                      </div>
                      <div className="text-xs text-gray-600">Reviewed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getApplicationStatusCount(job.applications, 'accepted')}
                      </div>
                      <div className="text-xs text-gray-600">Accepted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {getApplicationStatusCount(job.applications, 'rejected')}
                      </div>
                      <div className="text-xs text-gray-600">Rejected</div>
                    </div>
                  </div>
                </div>

                {/* Recent Applications */}
                {job.applications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Applications</h4>
                    <div className="space-y-2">
                      {job.applications.slice(0, 3).map((application) => (
                        <div key={application._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {application.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{application.user.name}</p>
                              <p className="text-xs text-gray-500 capitalize">
                                {application.user.role} • Applied {formatDate(application.appliedAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      ))}
                      {job.applications.length > 3 && (
                        <p className="text-sm text-gray-500 pt-2">
                          +{job.applications.length - 3} more applications
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Job
                    </Link>
                  </div>

                  <div className="flex space-x-2">
                    {job.applications.length > 0 && (
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200">
                        Manage Applications
                      </button>
                    )}
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition duration-200 flex items-center">
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={deletingJobId === job._id}
                      className={`bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200 flex items-center ${
                        deletingJobId === job._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <TrashIcon className="h-3 w-3 mr-1" />
                      {deletingJobId === job._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobsPage;