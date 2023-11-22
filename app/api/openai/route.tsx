//this is the route for the openai api

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai"
import axios from "axios";

/*
export async function POST(req:NextRequest, res:NextResponse) {
    try {
        const body = await req.json();

        const { title, description, keywords, length, social, tone } = body as PostPrompt;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                role: "system",
                content: `You are an amazing, ${social} media manager who writes amazing and thought provoking posts.`,
                },
                {
                role: "user",
                content: `Write me an interesting and eyecatching ${social} post of length ${length} from a first person narrative about ${description}.
                    The title is: ${title} and the keywords are ${keywords}. The post should be SEO friendly and use the ${tone}.`,
                },
            ],
        })

        const postResponse = completion.choices[0]?.message?.content;
        const post:Post = {
            title: "",
            content: postResponse || "",
            uid: "",
        }

        console.log(postResponse);

        return NextResponse.json({success: true, post: post}, {status: 200});
    } catch (error) {
    console.log(error);
    return NextResponse.error();
    }
}
*/

export async function POST(req:NextRequest, res:NextResponse) {
    const openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY,
    })
    const body = await req.json();
    const { title, description, keywords, length, social, tone } = body as PostPrompt;
    const message = await fetch('https://api.openai.com/v1/chat/completions',{
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            'Authorization': `Bearer ${openai.apiKey}`,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
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
            
        })
   })
   const data = await message.json()
    console.log(data)
    const postResponse = data.choices[0]?.message?.content;
    console.log(postResponse)

    const post:Post = {
        title: "",
        content: postResponse || "",
        uid: "",
    }
   return NextResponse.json({success: true, post:post}, {status: 200})
}

//this is the route for the openai api
/*import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url)

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      max_tokens: 7,
      temperature: 0,
      stream: true,
    })

    return new Response(completion.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error: any) {
    console.error(error)

    return new NextResponse(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const runtime = "edge"

export default handler
*/