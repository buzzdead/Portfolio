import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const apiKey = process.env.OPENAI_KEY

const configuration = new Configuration({
    apiKey: apiKey
});

const openai = new OpenAIApi(configuration);
export default async function POST(request: Request) {
    const { image, aiSetup } = await request.json();

    const systemMessage = {
        role: "system",
        content: `
            ${aiSetup}
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