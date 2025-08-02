import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { userAPI, handleAPIError } from '../utils/api';
import toast from 'react-hot-toast';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyApplications();
      setApplications(response.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.application.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.application.status === 'pending').length,
    reviewed: applications.filter(app => app.application.status === 'reviewed').length,
    accepted: applications.filter(app => app.application.status === 'accepted').length,
    rejected: applications.filter(app => app.application.status === 'rejected').length
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'pending', label: 'Pending' },
            { key: 'reviewed', label: 'Reviewed' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 $${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({statusCounts[key]})
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start applying for jobs to see your applications here</p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Browse Jobs
          </Link>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No applications found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link 
                      to={`/jobs/${app.job._id}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {app.job.title}
                    </Link>
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      {app.job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {app.job.location}
                    </div>
                    <span className="capitalize">
                      {app.job.jobType.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Applied {formatDate(app.application.appliedAt)}
                    </div>
                    {app.job.postedBy && (
                      <span>
                        Posted by {app.job.postedBy.name} ({app.job.postedBy.role})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium $${getStatusColor(app.application.status)}`}>
                    {app.application.status.charAt(0).toUpperCase() + app.application.status.slice(1)}
                  </span>
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Job →
                  </Link>
                </div>
              </div>

              {/* Application Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Application Status</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 $${
                        app.application.status === 'pending' ? 'bg-blue-500 w-1/4' :
                        app.application.status === 'reviewed' ? 'bg-yellow-500 w-2/4' :
                        app.application.status === 'accepted' ? 'bg-green-500 w-full' :
                        'bg-red-500 w-3/4'
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Applied</span>
                  <span>Under Review</span>
                  <span>Decision</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
