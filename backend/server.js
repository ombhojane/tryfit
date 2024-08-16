// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Set your frontend origin
  credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://aminvasudev6:wcw9QsKgW3rUeGA4@waybillcluster.88jnvsg.mongodb.net/?retryWrites=true&w=majority&appName=waybillCluster', { useNewUrlParser: true, useUnifiedTopology: true });

const Avatar = mongoose.model('Avatar', {
    userId: String,
    features: {
      gender: String,
      skinTone: String,
      hairColor: String,
      eyeColor: String,
      height: Number,
      shirtColor: String,
      pantsColor: String
    }
  });  

app.post('/api/avatar', async (req, res) => {
  try {
    const newAvatar = new Avatar(req.body);
    await newAvatar.save();
    res.status(201).json(newAvatar);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create avatar' });
  }
});

app.get('/api/avatar/:userId', async (req, res) => {
  try {
    const avatar = await Avatar.findOne({ userId: req.params.userId });
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    res.json(avatar);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
