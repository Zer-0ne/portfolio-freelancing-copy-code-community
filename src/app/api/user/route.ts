
import Users from "@/Models/Users";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextResponse } from "next/server";

// Fetching all the events
export const GET = async () => {
    await connect();
    const users = await Users.find({});

    const session = await currentSession() as Session;
    if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

    // check the user is admin or not 
    const user = await Users.findOne({ username: session?.user?.username })
    if (['user','moderator'].includes(user.role)) return NextResponse.json({ message: 'You are not Authorized!' }, { status: 401 })


    // Create a new array without the password field
    const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    });

    return NextResponse.json(
        sanitizedUsers
    );
}