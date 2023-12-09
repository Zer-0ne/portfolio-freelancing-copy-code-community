import Blog from "@/Models/Blog";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// Fetching all the blog
export const GET = async () => {
    await connect();
    const blog = await Blog.find({});
    return NextResponse.json({
        blog,
    });
}

// create blog
export const POST = async (request: NextRequest) => {
    try {
        const {
            title,
            description,
            tag,
            content,
            comments,
            authorId
        } = await request.json();
        await connect();
        const newBlog = new Blog({
            title,
            description,
            tag,
            content,
            comments,
            authorId
        });

        // Save the new post to the database
        await newBlog.save();
        return NextResponse.json({ message: 'created secussfully' })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}