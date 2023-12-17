import Event from "@/Models/Event";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Fetching all the events
export const GET = async () => {
    await connect();
    const event = await Event.find({});
    return NextResponse.json({
        event,
    });
}

// create event
export const POST = async (request: NextRequest) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // connect to the database
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
            label,
            authorId
        } = await request.json();

        const participantsInt = Number(participants)
        const newEvent = new Event({
            title,
            description,
            tag,
            content,
            mode,
            participants: participantsInt,
            status,
            image,
            label,
            authorId
        });

        // Save the new post to the database
        await newEvent.save();

        return NextResponse.json({ message: 'created secussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
