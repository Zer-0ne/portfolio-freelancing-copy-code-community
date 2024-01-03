import Event from "@/Models/Event";
import Users from "@/Models/Users";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// Fetching all the events
export const GET = async () => {
    await connect();
    const event = await Event.find({});
    return NextResponse.json(event,
    );
}

// create event
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // check the user is admin, moderator or not 
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })


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
            authorId,
            contentImage,
            eventDate
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
            authorId,
            contentImage,
            eventDate
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
