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
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      setDeletingJobId(jobId);
      await jobAPI.deleteJob(jobId);
      toast.success('Job deleted successfully');
      setJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setDeletingJobId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const getApplicationStatusCount = (apps, status) =>
    apps.filter(app => app.status === status).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
          <p className="text-gray-600">Manage your job postings and view applications</p>
        </div>
        <Link
          to="/create-job"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No jobs posted yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first job opportunity</p>
          <Link
            to="/create-job"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>{job.company}</span>
                      <span>{job.location}</span>
                      <span className="capitalize">
                        {job.jobType.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(job.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        {job.views} views
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      job.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Applications Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Applications ({job.applications.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                      <div key={status}>
                        <div className={`text-2xl font-bold ${
                          status === 'pending' ? 'text-blue-600' :
                          status === 'reviewed' ? 'text-yellow-600' :
                          status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {getApplicationStatusCount(job.applications, status)}
                        </div>
                        <div className="text-xs text-gray-600 capitalize">{status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Applications */}
                {job.applications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Applications</h4>
                    <div className="divide-y divide-gray-100">
                      {job.applications.slice(0, 3).map((app) => (
                        <div key={app._id} className="flex justify-between items-center py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                              {app.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{app.user.name}</p>
                              <p className="text-xs text-gray-500">
                                {app.user.role} • {formatDate(app.appliedAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
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

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Job
                  </Link>

                  <div className="flex gap-2">
                    {job.applications.length > 0 && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Manage Applications
                      </button>
                    )}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={deletingJobId === job._id}
                      className={`bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 ${
                        deletingJobId === job._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4" />
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
