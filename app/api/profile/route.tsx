//this is the route for the profile api
//get the credits from the profile db


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
                name: user.name,
                email: user.email,
                credits: 50,
            });

            profile = {
                uid: user.sub,
                name: user.name,
                email: user.email,
                credits: 50,
            }
        } else {
            profile = await db.collection("profiles").findOne({ uid: user.sub });
        }

        return NextResponse.json({ success: true, profile: profile})
    } catch (error) {
        return NextResponse.json({success: false})
    }
})