import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Job API functions
export const jobAPI = {
  // Get all jobs with filters
  getJobs: async (params = {}) => {
    const response = await axios.get('/jobs', { params });
    return response.data;
  },

  // Get single job by ID
  getJob: async (id) => {
    const response = await axios.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await axios.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await axios.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await axios.delete(`/jobs/${id}`);
    return response.data;
  }
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async (id) => {
    const response = await axios.get(`/users/profile/${id}`);
    return response.data;
  },

  // Get user's posted jobs
  getMyJobs: async () => {
    const response = await axios.get('/users/my-jobs');
    return response.data;
  },

  // Apply for job
  applyForJob: async (jobId) => {
    const response = await axios.post(`/users/apply/${jobId}`);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await axios.get('/users/my-applications');
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (jobId, userId, status) => {
    const response = await axios.put(`/users/application-status/${jobId}/${userId}`, { status });
    return response.data;
  }
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

export default {
  jobAPI,
  userAPI,
  handleAPIError
};
