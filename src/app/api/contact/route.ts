import Contact from "@/Models/Contact";
import { userInfo } from "@/utils/FetchFromApi";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// create blog
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
        return NextResponse.json({ message: 'created secussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}