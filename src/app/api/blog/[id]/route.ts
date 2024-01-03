import Blog from "@/Models/Blog";
import Users from "@/Models/Users";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// fetching the one blog
export const GET = async (request: NextRequest, { params }: any) => {
    try {
        await connect();
        const { id } = params;
        const blog = await Blog.findById(id)
        return NextResponse.json(blog)
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// delete one blog
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login', status: 'error' }, { status: 401 })

        // check the user is admin and moderator or not 
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!', status: 'error' }, { status: 401 })

        // connect to Database
        await connect();
        const { id } = params
        const deleteBlog = await Blog.findByIdAndDelete(id)
        if (!deleteBlog) return NextResponse.json({ message: 'Blog not found!', status: 'error' })
        return NextResponse.json({ message: 'Delete seccussfully', status: 'success' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// edit blog
export const PUT = async (request: NextRequest, { params }: any) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login', status: 'error' }, { status: 401 })

        // check the user is admin and moderator or not 
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!', status: 'error' }, { status: 401 })


        // connect to Database
        await connect();
        const {
            title,
            description,
            tag,
            content,
            comments,
            authorId
        } = await request.json();
        const updatedBlog = {
            title,
            description,
            tag,
            content,
            comments,
            authorId
        }
        const { id } = params
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $set: updatedBlog },
            { new: true }
        );
        if (!blog) return NextResponse.json({ message: 'Blog not found!', status: 'error' })
        return NextResponse.json({ message: 'Blog updated!', status: 'success' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}