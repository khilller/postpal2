import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";
import OpenAI from "openai"

export type ChatGptAgent = "user" | "system";

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

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
    stream: boolean,
    n: number,
}

export async function OpenAIStream( payload: Payload) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const res = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openai.apiKey || ""}`
        },
        body: JSON.stringify(payload)
    });

    let counter = 0;

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if(event.type === "event") {
                    const data = event.data;

                    if(data === "[DONE]") {
                        controller.close();
                        return;
                    }

                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || "";

                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;

                    } catch (error) {
                        controller.error(error);
                    }
                }
            }
            const parser = createParser(onParse);

            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        }
    });
    return stream;

}