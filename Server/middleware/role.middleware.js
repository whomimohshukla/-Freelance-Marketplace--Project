// Simple role-based access control middleware
// Usage: const role = require('./middleware/role.middleware');
// router.post('/admin-only', auth, role('Admin'), handler)

module.exports = (...allowedRoles) => {

  return (req, res, next) => {
    console.log('ROLE ->', req.user.role);
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
};
