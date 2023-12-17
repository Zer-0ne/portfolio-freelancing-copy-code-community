import Event from "@/Models/Event";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// fetching the one blog
export const GET = async (request: NextRequest, { params }: any) => {
    try {
        await connect();
        const { id } = params;
        const blog = await Event.findById(id)
        return NextResponse.json({ blog })
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
        const session = await currentSession();
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // connect to Database
        await connect();
        const { id } = params
        const deleteBlog = await Event.findByIdAndDelete(id)
        if (!deleteBlog) return NextResponse.json({ message: 'Blog not found!' })
        return NextResponse.json({ message: 'Delete seccussfully' })
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
        const session = await currentSession();
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // connect to Database
        await connect();
        const {
            title,
            description,
            tag,
            content,
            mode,
            participants,
            status,
            image,
            label
        } = await request.json();
        const updatedBlog = {
            title,
            description,
            tag,
            content,
            mode,
            participants,
            status,
            image,
            label
        }
        const { id } = params
        const blog = await Event.findByIdAndUpdate(
            id,
            { $set: updatedBlog },
            { new: true }
        );
        if (!blog) return NextResponse.json({ message: 'Blog not found!' })
        return NextResponse.json({ message: 'Blog updated!' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}