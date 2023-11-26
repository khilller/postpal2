//this is the route for the profile api

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"

const withApiAuthRequiredExtended = withApiAuthRequired as any

export const GET = withApiAuthRequiredExtended (async (request: NextRequest, response: NextResponse) => {
    const { db } = await connectToDatabase()
    try {
        const session = await getSession(request, response)
        const user = session?.user;

        if (!user) {
            return NextResponse.error();
        }
        let profile;
        const data = await db.collection("profiles").find({
            uid: user.sub
        }).toArray();
        if (data.length === 0) {
            await db.collection("profiles").insertOne({
                uid: user.sub,
                credits: 0,
            });

            profile = {
                uid: user.sub,
                credits: 0,
            }
        } else {
            profile = data[0];
        }

        return NextResponse.json({ success: true, posts: data})
    } catch (error) {
        return NextResponse.json({success: false})
    }
})