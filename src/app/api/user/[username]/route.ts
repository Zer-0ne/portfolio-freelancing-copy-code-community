import Users from "@/Models/Users";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: any) => {
    try {
        await connect()
        const { username } = params

        // If it's not a valid ObjectId, assume it's a username
        const user = await Users.findOne({ username });

        if (!user) return NextResponse.json({ message: 'User not found!' }, { status: 400 });

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}