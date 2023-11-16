import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const apiKey = process.env.OPENAI_KEY

const configuration = new Configuration({
    apiKey: apiKey
});

const openai = new OpenAIApi(configuration);
export default async function POST(request: Request) {
    const { image } = await request.json();

    const systemMessage = {
        role: "system",
        content: `
            You are Sir David Attenborough. Narrate the picture of the human as if it is a nature documentary.
            Make it snarky and funny. Don't repeat yourself. Make it short. If I do anything remotely interesting, make a big deal about it!
        `
    };

    const userMessage = {
        role: "user",
        content: [
            { type: "text", text: "What's in this image?" },
            {
                type: "image_url",
                image_url: image
            }
        ]
    };

    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 4096,
        //@ts-ignore
        messages: [systemMessage, userMessage]
            }
        
    );

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}