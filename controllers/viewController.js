const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.renderLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.renderSignup = (req, res) => {
  res.render('signup', { title: 'Signup' });
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'teamTaskToken');
  res.redirect('/login');
};

const setTokenCookie = (res, token) => {
  res.cookie(process.env.COOKIE_NAME || 'teamTaskToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

exports.handleSignup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('error', { message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role: role || 'member' });
    const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    setTokenCookie(res, token);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).render('error', { message: 'Invalid credentials' });
    }

    const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    setTokenCookie(res, token);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.renderDashboard = async (req, res) => {
  const user = req.user;
  const allProjects = await Project.find().populate('members', 'name email');
  const projectOptions = allProjects.filter((project) => project.members.some((member) => member._id.toString() === user._id.toString()));

  const tasks = await Task.find(user.role === 'admin' ? {} : { assignedTo: user._id })
    .populate('assignedTo', 'name email')
    .populate('projectId', 'name');

  const members = await User.find({}, 'name email role');

  const now = new Date();
  const overdueCount = tasks.filter((task) => task.dueDate < now && task.status !== 'done').length;
  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const pendingCount = tasks.filter((task) => task.status !== 'done').length;

  res.render('dashboard', {
    title: 'Dashboard',
    user,
    tasks,
    members,
    projects: projectOptions,
    overdueCount,
    completedCount,
    pendingCount,
    totalCount: tasks.length,
  });
};

exports.createProjectForm = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Project.create({ name, description, createdBy: req.user._id, members: [req.user._id] });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.addMemberForm = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found' });
    }
    const member = await User.findOne({ email });
    if (!member) {
      return res.status(404).render('error', { message: 'User not found' });
    }
    if (!project.members.some((memberId) => memberId.toString() === member._id.toString())) {
      project.members.push(member._id);
      await project.save();
    }
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.createTaskForm = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found' });
    }
    if (!project.members.some((memberId) => memberId.toString() === assignedTo.toString())) {
      return res.status(400).render('error', { message: 'Assigned user must be a project member' });
    }
    await Task.create({ title, description, assignedTo, projectId, dueDate, createdBy: req.user._id });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.updateTaskForm = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found' });
    }
    if (req.user.role === 'member' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).render('error', { message: 'You may only update your own task status' });
    }
    task.status = status;
    await task.save();
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};
