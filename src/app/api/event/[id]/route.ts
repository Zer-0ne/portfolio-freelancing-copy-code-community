import Event from "@/Models/Event";
import Users from "@/Models/Users";
import { Data, Session } from "@/utils/Interfaces";
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

        if (['user', 'editor'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!', status: 'error' }, { status: 401 })


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
        if (!session) return NextResponse.json({ message: 'Please login', status: 'error' }, { status: 401 });

        // Check if user is authorized
        const user = await Users.findOne({ username: session?.user?.username });

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'You are not Authorized!', status: 'error' }, { status: 401 });

        // Connect to Database
        await connect();

        const body = await request.json();
        const { id } = params;

        console.log("Updating event ID:", id);
        console.log("Received data:", body);

        // Fetch existing event
        const existingEvent = await Event.findById(id);
        if (!existingEvent) return NextResponse.json({ message: 'Post not found!', status: 'error' });

        // Extract only changed fields
        const updatedFields = {} as Data;
        for (const key in body) {
            if (body[key] !== undefined && body[key] !== existingEvent[key]) {
                updatedFields[key] = body[key];
            }
        }

        console.log("Updated fields:", updatedFields);

        if (Object.keys(updatedFields).length === 0) {
            return NextResponse.json({ message: 'No changes detected.', status: 'warning' });
        }

        // Update event
        const event = await Event.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );

        return NextResponse.json({ message: 'Post updated!', status: 'success', event });
    } catch (err: any) {
        console.error("Update Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};
