import Blog from "@/Models/Blog";
import Comment from "@/Models/Comment";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// create new comment
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        const {
            comment, authorId, blogId, replies
        } = await request.json();
        await connect();
        const newBlog = new Comment({
            comment, authorId, blogId, replies
        });

        // Save the new post to the database
        const data = await newBlog.save();
        const relativePost = await Blog.findById(blogId)
        await relativePost?.comments?.push(data._id)
        await relativePost.save();
        return NextResponse.json({ message: 'Comment secussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}