import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAI } from 'openai';

export const runtime = 'edge';

const apiKey = process.env.OPENAI_KEY

const configuration = new Configuration({
    apiKey: apiKey
});

const openai = new OpenAI({apiKey: apiKey});
export default async function POST(request: Request) {
    const { image, aiSetup, additional } = await request.json();

    const systemMessage = {
        role: "system",
        content: `
            ${aiSetup}
        `
    };

    const userMessage = [
        {
            role: "system",
            content: `
                ${aiSetup}
            `
        },
        {
        role: "user",
        content: [
            { type: "text", text: "What's in this image?" + additional },
            {
                type: "image_url",
                image_url: {url: image}
            }
        ]
    }];

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1000,
        stream: true,
        //@ts-ignore
        messages: userMessage
            }
        
    );
    console.log(response)

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}