const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
} = require('../controllers/taskController');

router.use(authMiddleware);
router.post('/', authorizeRole('admin'), createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);

module.exports = router;
