//this is the route for the chat api

import { OpenAIStream } from "@/lib/functions/openaiStream";
import { withMiddlewareAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";
import { useUser } from "@auth0/nextjs-auth0/client";
import { connectToDatabase } from "@/lib/mongodb"
import { get } from "http";

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
    stream: boolean,
    n: number,
}

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
}

const withMiddlewareAuthRequiredEdge = withMiddlewareAuthRequired as any

export const POST = withMiddlewareAuthRequiredEdge (async (req: Request) => {
    //const { db } = await connectToDatabase()
    const data = (await req.json())
    const { title, description, keywords, length, social, tone } = data as PostPrompt;
    //console.log(data)
    //const { title, description, keywords, length, social, tone } = data as PostPrompt;
    if (!data) return new Response("No data provided", { status: 400 });

   //const { user } = await getSession(req, res);

   /*
    const profile  = await db.collection("profiles").find({ uid: user?.sub }).toArray();

    if (profile[0].credits < 1) {
        return new Response("Not enough credits", { status: 400 });
    }
    */

    const payload: Payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "You are an amazing, social media manager who writes amazing and thought provoking posts."
            },
            {
                "role": "user",
                "content": `Write me an interesting and eyecatching ${social} post of length ${length} from a first person narrative about ${description}.
                The title is: ${title} and the keywords are ${keywords}. The post should be SEO friendly and use the ${tone}.`
            }
        ],
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload);
    /*
    await db.collection("profiles").updateOne(
        { uid: user?.sub },
        { $inc: { credits: -1 } }
    );
    */

    return new Response(stream, { status: 200 });

});
