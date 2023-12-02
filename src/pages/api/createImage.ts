// pages/api/createImage.js

import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

const openaiEndpoint = 'https://api.openai.com/v1/images/generations';
const apiKey = process.env.OPENAI_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      const requestData = {
        prompt: "A narrative has been generated for a selfie a person has taken, read the narrative and provide a fitting image " + prompt,
        model: "dall-e-3",
        n: 1, // Number of images to generate
        size: '1024x1024', // Image size
      };

      const response = await axios.post(openaiEndpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`, // Use environment variable for API key
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error generating images:', error);
      res.status(500).json({ error: 'Error generating images' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
