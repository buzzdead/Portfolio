import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAI } from 'openai';

export const runtime = 'edge';

const apiKey = process.env.OPENAI_KEY;

const openai = new OpenAI({ apiKey });

export default async function handler(request: Request) {
  if (request.method === 'POST') {
    const { images, aiSetup, additional } = await request.json();

    const promptMessages = [
      {
        role: 'system',
        content: 'You are an expert of analyzing sequences of images, interpertating them as a video.' + aiSetup
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'These are the sequential images that make up the video. Describe the  what is going on in the clip ' + additional },
          ...images.map((image: string) => ({
            type: 'image_url' as const,
            image_url: {
              url: image,
              detail: 'low' as const,
            },
          })),
        ],
      },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 100,
        //@ts-ignore
        messages: promptMessages,
      });

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return new Response('Method not allowed', {
    status: 405,
  });
}
