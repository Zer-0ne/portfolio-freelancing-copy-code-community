import Contact from "@/Models/Contact";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// Fetching all the contact
export const GET = async () => {
    await connect();
    const contact = await Contact.find({});
    return NextResponse.json(contact);
}

// create contact
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })
        const {
            firstname,
            lastname,
            email,
            content,
            phone,
        } = await request.json();
        await connect();
        const newContent = new Contact({
            firstname,
            lastname,
            email,
            content,
            phone,
        });

        // Save the new post to the database
        await newContent.save();
        return NextResponse.json({ message: 'Thank you to contact us!' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}