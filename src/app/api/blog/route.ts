import Blog from "@/Models/Blog";
import Users from "@/Models/Users";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// Fetching all the blog
export const GET = async (request: NextRequest) => {

    await connect();
    const blog = await Blog.find({});
    return NextResponse.json(blog
    );
}


// create blog
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })
        const {
            title,
            description,
            tag,
            content,
            comments,
            authorId,
            contentImage
        } = await request.json();
        await connect();
        const newBlog = new Blog({
            title,
            description,
            tag,
            content,
            comments,
            authorId,
            contentImage
        });

        // Save the new post to the database
        await newBlog.save();
        return NextResponse.json({ message: 'created secussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}