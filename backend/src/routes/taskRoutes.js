import express from 'express';
import Taskmodel from '../models/task.js';

const router = express.Router();


// Escapes regex special characters so user input is searched as plain text.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sendError = (res, error, fallbackMessage) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
    error: error.message,
  });
};


router.post('/create-task', async (req, res) => {
  try {
    const { title, description, date, startAt, endAt, priority, isCompleted } = req.body;

    const newTask = new Taskmodel({
      title,
      description,
      date,
      startAt,
      endAt,
      priority: priority || 'low',
      isCompleted,
    });

    await newTask.save();

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    sendError(res, error, 'Error occured while creating task');
  }
});


router.get('/get-tasks', async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Valid "from" and "to" dates are required',
      });
    }

    if (from > to) {
      return res.status(400).json({
        success: false,
        message: '"from" must not be after "to"',
      });
    }

    const tasks = await Taskmodel.find({ date: { $gte: from, $lte: to } })
      .sort({ date: 1, startAt: 1 })
      .lean();

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    sendError(res, error, 'Error occured while fetching tasks');
  }
});


router.get('/search-tasks', async (req, res) => {
  try {
    const { searchKey } = req.query;

    if (typeof searchKey !== 'string' || !searchKey.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search keyword is required',
      });
    }

    const keyword = new RegExp(escapeRegex(searchKey.trim()), 'i');

    const tasks = await Taskmodel.find({
      $or: [{ title: keyword }, { description: keyword }],
    })
      .sort({ date: -1, startAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    sendError(res, error, 'Error occured while searching tasks');
  }
});


router.patch('/update-task/:id', async (req, res) => {
  try {
    const { title, description, date, startAt, endAt, priority } = req.body ?? {};

    const task = await Taskmodel.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.set({
      title,
      description,
      date,
      startAt,
      endAt,
      priority: priority || 'low',
    });

    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    sendError(res, error, 'Error occured while updating task');
  }
});


router.patch('/update-task-status/:id', async (req, res) => {
  try {
    const { isCompleted } = req.body ?? {};

    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: '"isCompleted" must be true or false',
      });
    }

    const task = await Taskmodel.findByIdAndUpdate(
      req.params.id,
      { isCompleted },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    sendError(res, error, 'Error occured while updating task status');
  }
});


router.delete('/delete-task/:id', async (req, res) => {
  try {
    const task = await Taskmodel.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    sendError(res, error, 'Error occured while deleting task');
  }
});

export default router;