import Comment from "@/Models/Comment";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// create new comment
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        // if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        const {
            comment, userId, blogId, eventId, replies
        } = await request.json();
        await connect();
        const newBlog = new Comment({
            comment, userId, blogId, eventId, replies
        });

        // Save the new post to the database
        await newBlog.save();
        return NextResponse.json({ message: 'Comment secussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}