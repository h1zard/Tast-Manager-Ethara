const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user is not a project member' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user._id };

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'member' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Members can only update their assigned tasks' });
    }

    if (status) {
      task.status = status;
    }

    await task.save();
    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
