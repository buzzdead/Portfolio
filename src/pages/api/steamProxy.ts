// pages/api/steamProxy.ts

import axios from 'axios';

export default async (req: any, res: any) => {
  try {
    const response = await axios.get(`https://api.steampowered.com${req.url}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};