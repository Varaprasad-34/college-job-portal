const validateCollegeEmail = (req, res, next) => {
  const { email, role } = req.body;
  const collegeDomain = process.env.COLLEGE_EMAIL_DOMAIN || '@cmrec.ac.in';

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Only enforce domain restriction if the role is "student"
  if (role === "student" && !email.endsWith(collegeDomain)) {
    return res.status(400).json({
      message: `Students must register with a ${collegeDomain} email address.`,
    });
  }

  next();
};

module.exports = { validateCollegeEmail };
