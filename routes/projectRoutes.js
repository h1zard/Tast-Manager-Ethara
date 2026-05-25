const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
  createProject,
  getProjects,
  addMember,
  removeMember,
} = require('../controllers/projectController');

router.use(authMiddleware);
router.post('/', authorizeRole('admin'), createProject);
router.get('/', getProjects);
router.post('/:projectId/members', authorizeRole('admin'), addMember);
router.delete('/:projectId/members/:memberId', authorizeRole('admin'), removeMember);

module.exports = router;
