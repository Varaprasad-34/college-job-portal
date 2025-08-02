const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        // Validate email format and college domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const collegeDomain = process.env.COLLEGE_EMAIL_DOMAIN || '@college.edu';
        return emailRegex.test(email) && email.endsWith(collegeDomain);
      },
      message: 'Please provide a valid college email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['student', 'alumni'],
    required: [true, 'User role is required']
  },
  graduationYear: {
    type: Number,
    required: function() {
      return this.role === 'alumni';
    },
    validate: {
      validator: function(year) {
        if (this.role === 'alumni') {
          const currentYear = new Date().getFullYear();
          return year <= currentYear && year >= (currentYear - 50);
        }
        return true;
      },
      message: 'Please provide a valid graduation year'
    }
  },
  major: {
    type: String,
    required: [true, 'Major/Field of study is required'],
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+'],
    default: '0-1'
  },
  currentPosition: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  linkedinProfile: {
    type: String,
    validate: {
      validator: function(url) {
        if (!url) return true;
        return /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(url);
      },
      message: 'Please provide a valid LinkedIn profile URL'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);
