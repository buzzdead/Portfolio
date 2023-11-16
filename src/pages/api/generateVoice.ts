import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text, voice_id } = req.body;

    const API_KEY = process.env.ELEVEN_API_KEY;
    const VOICE_ID = voice_id || 'W9Sme726LTRRST7a9TqU';

    try {
        const options = {
            method: 'POST',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
            headers: {
                accept: 'audio/mpeg',
                'content-type': 'application/json',
                'xi-api-key': API_KEY,
            },
            data: { text: text, model: 'eleven_turbo_v2' },
            responseType: 'stream',
        };
        //@ts-ignore
        const response = await axios.request(options);

        response.data.pipe(res);
    } catch (error) {
        console.error('Error in text to speech conversion:', error);
        res.status(500).json({ error: 'Error in text to speech conversion' });
    }
}
