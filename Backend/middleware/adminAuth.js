module.exports = function (req, res, next) {
  // Check if user exists and is admin
  if (!req.user) {
    return res.status(401).json({ message: "No user found in request" });
  }

  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }

  next();
};
