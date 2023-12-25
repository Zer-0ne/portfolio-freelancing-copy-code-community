import Users from "@/Models/Users";
import { userInfo } from "@/utils/FetchFromApi";
import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
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

// edit blog
export const PUT = async (request: NextRequest, { params }: any) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user?.isAdmin === false) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        // connect to Database
        await connect();
        const {
            name,
            password,
            email,
            role,
            isAdmin,
            followings,
            followers,
            saved,
            image
        } = await request.json();
        const updatedUser = {
            name,
            password,
            email,
            role,
            isAdmin,
            followings,
            followers,
            saved,
            image
        }
        const { username } = params
        const User = await Users.findOneAndUpdate(
            { username },
            { $set: updatedUser },
            { new: true }
        );
        if (!User) return NextResponse.json({ message: 'User not found!' })
        return NextResponse.json({ message: 'User updated!' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// delete one user
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user?.isAdmin === false) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        // connect to Database
        await connect();
        const { username } = params
        const deleteUser = await Users.findOneAndDelete({ username })
        if (!deleteUser) return NextResponse.json({ message: 'User not found!' })
        return NextResponse.json({ message: 'Delete seccussfully' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}