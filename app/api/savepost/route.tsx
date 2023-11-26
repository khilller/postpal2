//this is the route for saving a post

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

const withApiAuthRequiredExtended = withApiAuthRequired as any

export const POST = withApiAuthRequiredExtended (async (req: NextRequest, res: NextResponse) => {
    const { db } = await connectToDatabase()
    const data = await req.json();
    //const { title, content, uid } = data as Post
    //console.log(data)
    const test = await db.collection("posts").insertOne(data);

    return NextResponse.json({success: true})
})
