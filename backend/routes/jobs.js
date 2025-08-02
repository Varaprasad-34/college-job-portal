const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Private (students and alumni only)
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString(),
  query('jobType').optional().isIn(['full-time', 'part-time', 'internship', 'contract', 'remote']),
  query('experienceLevel').optional().isIn(['entry', 'mid', 'senior', 'executive']),
  query('postedByRole').optional().isIn(['student', 'alumni'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    if (req.query.jobType) {
      filter.jobType = req.query.jobType;
    }

    if (req.query.experienceLevel) {
      filter.experienceLevel = req.query.experienceLevel;
    }

    if (req.query.postedByRole) {
      filter.postedByRole = req.query.postedByRole;
    }

    // Handle search
    let jobs;
    if (req.query.search) {
      jobs = await Job.find({
        ...filter,
        $text: { $search: req.query.search }
      })
      .populate('postedBy', 'name role graduationYear')
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    } else {
      jobs = await Job.find(filter)
        .populate('postedBy', 'name role graduationYear')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const total = await Job.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      jobs,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (students and alumni only)
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Job title must be 5-100 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Job description must be 50-2000 characters'),
  body('company').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('jobType').isIn(['full-time', 'part-time', 'internship', 'contract', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel').optional().isIn(['entry', 'mid', 'senior', 'executive']),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('applicationDeadline').optional().isISO8601().withMessage('Invalid application deadline'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user.id,
      postedByRole: req.user.role
    };

    // Create tags from title, company, and skills for better searchability
    const tags = [
      ...req.body.title.toLowerCase().split(' '),
      req.body.company.toLowerCase(),
      ...(req.body.skills || []).map(skill => skill.toLowerCase())
    ];
    jobData.tags = [...new Set(tags)]; // Remove duplicates

    const job = new Job(jobData);
    await job.save();

    await job.populate('postedBy', 'name role graduationYear');

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name role graduationYear major company currentPosition')
      .populate('applications.user', 'name email role graduationYear major');

    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job posting (only by job creator)
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 50, max: 2000 }),
  body('company').optional().trim().isLength({ min: 2, max: 100 }),
  body('location').optional().trim().isLength({ min: 2 }),
  body('jobType').optional().isIn(['full-time', 'part-time', 'internship', 'contract', 'remote']),
  body('contactEmail').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job creator
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name role graduationYear');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job posting (only by job creator)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job creator
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    // Soft delete by setting isActive to false
    job.isActive = false;
    await job.save();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});

module.exports = router;
