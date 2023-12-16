import Blog from "@/Models/Blog";
import { currentSession } from "@/utils/FetchFromApi";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// fetching the one blog
export const GET = async (request: NextRequest, { params }: any) => {
    try {
        await connect();
        const { id } = params;
        const blog = await Blog.findById(id)
        return NextResponse.json({ blog })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}

// delete one blog
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        if (!currentSession()) return NextResponse.json({ message: 'Please login' }, { status: 401 })
        await connect();
        const { id } = params
        const deleteBlog = await Blog.findByIdAndDelete(id)
        if (!deleteBlog) return NextResponse.json({ message: 'Blog not found!' })
        return NextResponse.json({ message: 'Delete seccussfully' })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}

// edit blog
export const PUT = async (request: NextRequest, { params }: any) => {
    try {
        if (!currentSession()) return NextResponse.json({ message: 'Please login' }, { status: 401 })
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
        if (!blog) return NextResponse.json({ message: 'Blog not found!' })
        return NextResponse.json({ message: 'Blog updated!' })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}