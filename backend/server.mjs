import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import * as fal from "@fal-ai/serverless-client";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const FAL_KEY = process.env.FAL_KEY || '13b7e803-449d-4f27-8f4a-f597687901e2:6fb0319563f3e239830d1f7258a27bf5';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


mongoose.connect('mongodb+srv://aminvasudev6:wcw9QsKgW3rUeGA4@waybillcluster.88jnvsg.mongodb.net/?retryWrites=true&w=majority&appName=waybillCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Avatar = mongoose.model('Avatar', {
  userId: String,
  features: {
    gender: String,
    skinTone: String,
    hairColor: String,
    eyeColor: String,
    height: Number,
    shirtColor: String,
    pantsColor: String,
  },
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

fal.config({
  credentials: FAL_KEY,
});



app.post(
  '/api/tryon',
  upload.fields([
    { name: 'humanImage', maxCount: 1 },
    { name: 'garmentImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.humanImage || !req.files.garmentImage) {
        return res.status(400).json({ error: 'Missing required images' });
      }

      const humanImagePath = req.files.humanImage[0].path;
      const garmentImagePath = req.files.garmentImage[0].path;

      // Convert image files to Base64 or URLs
      const humanImageBase64 = fs.readFileSync(humanImagePath, { encoding: 'base64' });
      const garmentImageBase64 = fs.readFileSync(garmentImagePath, { encoding: 'base64' });

      // Submit the request to the FAL API
      const result = await fal.subscribe('fal-ai/idm-vton', {
        input: {
          human_image_url: `data:image/jpeg;base64,${humanImageBase64}`, // Using Base64 image data
          garment_image_url: `data:image/jpeg;base64,${garmentImageBase64}`, // Using Base64 image data
          description: 'Short Sleeve Round Neck T-shirts',
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      // Clean up temporary files
      fs.unlinkSync(humanImagePath);
      fs.unlinkSync(garmentImagePath);

      // Send the result back to the client
      res.json({ imageUrl: result.image.url });

    } catch (error) {
      console.error('Try-on error:', error);
      res.status(500).json({
        error: 'Failed to process try-on request',
        details: error.message,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
