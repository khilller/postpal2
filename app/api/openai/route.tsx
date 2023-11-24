//this is the route for the openai api

import { NextRequest, NextResponse } from "next/server";
import { withMiddlewareAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";
import OpenAI from "openai"
import { OpenAIStream } from "ai";


export const runtime = "edge"

const withMiddlewareAuthRequiredEdge = withMiddlewareAuthRequired as any

export const  POST = withMiddlewareAuthRequiredEdge( async(req:NextRequest, res:NextResponse) => {

    const session = await getSession(); //use middleware to get the session
      const user = session?.user; //import the session from auth0
      if (!user) {
        return NextResponse.redirect("/api/auth/login");
      }

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
            stream: false
            
        })
   })
    const data = await message.json()
    const postResponse = data.choices[0]?.message?.content;

    const post:Post = {
        title: "",
        content: postResponse || "",
        uid: user?.sub,
    }
   
    return NextResponse.json({success: true, post:post}, { status: 200 })

})
