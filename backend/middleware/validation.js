const validateCollegeEmail = (req, res, next) => {
  const { email } = req.body;
  const collegeDomain = process.env.COLLEGE_EMAIL_DOMAIN || '@college.edu';

  if (!email || !email.endsWith(collegeDomain)) {
    return res.status(400).json({
      message: `Registration is restricted to ${collegeDomain} email addresses only.`
    });
  }

  next();
};

module.exports = { validateCollegeEmail };
