import Event from "@/Models/Event";
import { currentSession } from "@/utils/FetchFromApi";
import connect from "@/utils/database";
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
        // if not logged in then throw an error
        if (!currentSession()) return NextResponse.json({ message: 'Please login' }, { status: 401 })

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

        // connect to the database
        await connect();

        const newEvent = new Event({
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
        });

        // Save the new post to the database
        await newEvent.save();

        return NextResponse.json({ message: 'created secussfully' })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}
