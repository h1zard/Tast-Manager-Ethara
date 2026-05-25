const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }
      return res.status(403).render('error', { message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = authorizeRole;
