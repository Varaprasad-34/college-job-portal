import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const JobCard = ({ job }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'alumni' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <Link 
              to={`/jobs/${job._id}`}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {job.title}
            </Link>
          </h3>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {job.location}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(job.postedByRole)}`}>
            Posted by {job.postedByRole}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {job.jobType}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="text-gray-500 text-xs">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Posted {formatDate(job.createdAt)}
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
