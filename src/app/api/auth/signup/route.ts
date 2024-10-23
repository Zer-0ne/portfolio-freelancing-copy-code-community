import Users from "@/Models/Users";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { currentSession } from "@/utils/Session";
import { Session } from "@/utils/Interfaces";


export const POST = async (request: NextRequest) => {
    try {
        await connect()
        const {
            name,
            username,
            email,
            password,
            isAdmin,
            image,
        } = await request.json()
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })
        const currUser = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(currUser?.role) || !session) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        const existingUser = await Users.findOne({ username })
        if (existingUser) return NextResponse.json({ message: 'User Already exists' }, { status: 300 })

        const userParams: {
            username: string;
            name: string;
            email: string;
            image: string;
            password?: string; // Make password optional
        } = {
            username,
            name,
            email,
            image
        };

        if (password) {
            // encrypt the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            userParams.password = hashPassword;
        }

        const user = new Users(userParams);
        await user.save();


        return NextResponse.json({ message: 'User Created!' }, { status: 200 })
    } catch (error: {
        message: string
    } | any) {
        console.log(error.message)
        return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 })
    }
}