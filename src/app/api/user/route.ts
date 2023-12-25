
import Users from "@/Models/Users";
import connect from "@/utils/database";
import { NextResponse } from "next/server";

// Fetching all the events
export const GET = async () => {
    await connect();
    const user = await Users.find({});
    return NextResponse.json(
        user,
    );
}