const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID (public info only)
// @access  Private
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name role major graduationYear bio skills experience currentPosition company linkedinProfile createdAt'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posted jobs count
    const jobsPosted = await Job.countDocuments({ 
      postedBy: req.params.id, 
      isActive: true 
    });

    res.json({
      user,
      stats: {
        jobsPosted
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// @route   GET /api/users/my-jobs
// @desc    Get current user's posted jobs
// @access  Private
router.get('/my-jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('applications.user', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching your jobs' });
  }
});

// @route   POST /api/users/apply/:jobId
// @desc    Apply for a job
// @access  Private
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = job.applications.find(
      app => app.user.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Add application
    job.applications.push({
      user: req.user.id,
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error while applying for job' });
  }
});

// @route   GET /api/users/my-applications
// @desc    Get current user's job applications
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  try {
    const jobs = await Job.find({
      'applications.user': req.user.id,
      isActive: true
    })
    .populate('postedBy', 'name role')
    .sort({ 'applications.appliedAt': -1 });

    const applications = jobs.map(job => {
      const application = job.applications.find(
        app => app.user.toString() === req.user.id
      );

      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          postedBy: job.postedBy
        },
        application: {
          appliedAt: application.appliedAt,
          status: application.status
        }
      };
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error while fetching your applications' });
  }
});

// @route   PUT /api/users/application-status/:jobId/:userId
// @desc    Update application status (only by job poster)
// @access  Private
router.put('/application-status/:jobId/:userId', [
  auth,
  body('status').isIn(['pending', 'reviewed', 'rejected', 'accepted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job creator
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update application status' });
    }

    // Find and update application
    const application = job.applications.find(
      app => app.user.toString() === req.params.userId
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    await job.save();

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error while updating application status' });
  }
});

module.exports = router;
