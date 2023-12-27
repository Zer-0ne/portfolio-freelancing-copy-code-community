
import Users from "@/Models/Users";
import connect from "@/utils/database";
import { NextResponse } from "next/server";

// Fetching all the events
export const GET = async () => {
    await connect();
    const users = await Users.find({});

    // Create a new array without the password field
    const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    });

    return NextResponse.json(
        sanitizedUsers
    );
}