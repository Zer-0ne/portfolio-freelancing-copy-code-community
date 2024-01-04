import Event from "@/Models/Event";
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
        const event = await Event.findById(id)
        return NextResponse.json(event)
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// delete one blog
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login', status: 'error' }, { status: 401 })

        // check the user is admin and moderator or not 
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!', status: 'error' }, { status: 401 })


        // connect to Database
        await connect();
        const { id } = params
        const deletePost = await Event.findByIdAndDelete(id)
        if (!deletePost) return NextResponse.json({ message: 'Post not found!' })
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
        const event = await Event.findByIdAndUpdate(
            id,
            { $set: updatedBlog },
            { new: true }
        );
        if (!event) return NextResponse.json({ message: 'Post not found!', status: 'error' })
        return NextResponse.json({ message: 'Post updated!', status: 'success' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}