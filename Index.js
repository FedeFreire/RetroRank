const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/retroRank', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const scoreSchema = new mongoose.Schema({
  username: String,
  game: String,
  score: Number
});

const User = mongoose.model('User', userSchema);
const Score = mongoose.model('Score', scoreSchema);

// Root URL route
app.get('/', (req, res) => {
  res.send('Hello, welcome to RetroRank!');
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user == null) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(user.toJSON(), 'yourSecretKey');
      res.json({ accessToken });
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

// Submit a score
app.post('/submit-score', async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const newScore = new Score({ username, game, score });
    await newScore.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

// Get list of scores
app.get('/scores', async (req, res) => {
  try {
    const allScores = await Score.find();
    res.json(allScores);
  } catch {
    res.status(500).send();
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
