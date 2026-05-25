const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
  renderLogin,
  renderSignup,
  logout,
  renderDashboard,
  createProjectForm,
  addMemberForm,
  createTaskForm,
  updateTaskForm,
  handleSignup,
  handleLogin,
} = require('../controllers/viewController');

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.get('/logout', logout);
router.post('/signup', handleSignup);
router.post('/login', handleLogin);

router.get('/dashboard', authMiddleware, renderDashboard);
router.post('/dashboard/projects', authMiddleware, authorizeRole('admin'), createProjectForm);
router.post('/dashboard/projects/add-member', authMiddleware, authorizeRole('admin'), addMemberForm);
router.post('/dashboard/tasks', authMiddleware, authorizeRole('admin'), createTaskForm);
router.post('/dashboard/tasks/status', authMiddleware, updateTaskForm);

module.exports = router;
