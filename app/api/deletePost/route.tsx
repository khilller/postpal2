import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

const withApiAuthRequiredExtended = withApiAuthRequired as any;

export const POST = withApiAuthRequiredExtended(async (req: NextRequest, res: NextResponse) => {
    const { db } = await connectToDatabase();

    try {
        const session = await getSession(req, res); 
        const user = session?.user;
        if (!user) {
            return NextResponse.error();
        }
        const data = await req.json();
        const { _id } = data;
        await db.collection("posts").deleteOne({
            _id: new ObjectId(_id),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false });
    }
})