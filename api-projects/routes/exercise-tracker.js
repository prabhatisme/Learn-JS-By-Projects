import express from 'express';
const router = express.Router();
import { Users, Exercises } from '../mongo.js';

// let users = [];
// let exercises = [];

// Create a new user
router.post('/users', async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ error: 'Username is required' });
  
      let user = await Users.findOne({ username });
      if (user) return res.status(400).json({ error: 'Username already exists', _id: user._id });
  
      user = await new Users({ username }).save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Add an exercise
  router.post('/users/:_id/exercises', async (req, res) => {
    try {
      const { _id } = req.params;
      const { description, duration, date } = req.body;
  
      const user = await Users.findById(_id);
      if (!user) return res.status(404).json({ error: 'Users not found' });
  
      const exercise = new Exercises({
        userId: _id,
        description,
        duration: parseInt(duration),
        date: date ? new Date(date) : new Date(),
      });
  
      await exercise.save();
  
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Retrieve user ex:  "/users/absdsas/logs?from=2023&to=2021&limit=2"
  router.get('/users/:_id/logs', async (req, res) => {
    try {
      const { _id } = req.params;
      const { from, to, limit } = req.query;
  
      const user = await Users.findById(_id);
      if (!user) return res.status(404).json({ error: 'Users not found' });
  
      let query = { userId: _id };
      if (from) query.date = { $gte: new Date(from) };
      if (to) query.date = { ...query.date, $lte: new Date(to) };
  
      let exercises = Exercises.find(query);
      if (limit) exercises = exercises.limit(parseInt(limit));
  
      exercises = await exercises;
  
      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        logs: exercises.map(({ description, duration, date }) => ({
          description,
          duration,
          date: date.toDateString(),
        })),
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Get all users
  router.get('/users/all', async (req, res) => {
    try {
      const users = await Users.find({}, { username: 1, _id: 1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 
router.post('/users', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists', _id: existingUser._id });
  }

  const newUser = { username, _id: Math.random().toString(36).substring(7) };
  users.push(newUser);
  res.json(newUser);
});

router.post('/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = users.find(user => user._id === _id);
  if (!user) return res.status(404).json({ error: 'Users not found' });

  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }

  const exercise = {
    _id,
    username: user.username,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  exercises.push(exercise);
  res.json(exercise);
});

router.get('/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find(user => user._id === _id);
  if (!user) return res.status(404).json({ error: 'Users not found' });

  let userExercises = exercises.filter(ex => ex._id === _id);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(ex => new Date(ex.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(ex => new Date(ex.date) <= toDate);
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises.map(({ description, duration, date }) => ({
      description,
      duration,
      date,
    })),
  });
});

router.get('/users/all', (req, res) => {
  res.json(users.map(user => ({ username: user.username, _id: user._id })));
}); */

export default router;