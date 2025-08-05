import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { jobAPI, handleAPIError } from '../utils/api';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: '',
    postedByRole: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.current]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        search: searchTerm,
        ...filters
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await jobAPI.getJobs(params);
      setJobs(response.jobs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchJobs();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: '',
      experienceLevel: '',
      postedByRole: ''
    });
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Jobs</h1>

      {/* Search & Filter Actions */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 border rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
              <select
                value={filters.postedByRole}
                onChange={(e) => handleFilterChange('postedByRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="student">Students</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${pagination.total} job${pagination.total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Job Results */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:underline font-medium"
          >
            Clear filters to see all jobs
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 mb-10">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-md ${
                    page === pagination.current
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default JobsPage;
