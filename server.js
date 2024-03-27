const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Niku419:9438002199@cluster0.zagzgwc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  gender: String,
  skills: [String],
});

const User = mongoose.model('User', userSchema);

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password, gender, skills } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({
    username,
    password: hashedPassword,
    gender,
    skills,
  });

  // Save the user to the database
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Route to handle user login
app.post('/submit-form', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  // If user not found or password does not match, return error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate a JSON web token
  const token = jwt.sign({ username: user.username }, 'secretkey');

  res.status(200).json({ token });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
