//this is the route for the openai api

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})

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