import { OpenAIStream } from "@/lib/functions/openaiStream";

export const runtime = "edge"

export type ChatGptAgent = "user" | "system";

interface ChatGptMessage {
    role: ChatGptAgent,
    content: string,
}

interface Payload {
    model: string,
    messages: ChatGptMessage[],
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number,
    max_tokens: number,
    stream: true,
    n: number,
}




if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
}

export const POST = async (req: Request) => {
    const data = (await req.json()) as string;
    //const { title, description, keywords, length, social, tone } = data as PostPrompt;
    if (!data) return new Response("No data provided", { status: 400 });

    const payload: Payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user", content: data
            }
        ],
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 500,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload);
    return new Response(stream)


}