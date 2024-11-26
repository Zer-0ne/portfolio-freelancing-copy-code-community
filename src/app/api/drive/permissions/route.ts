import Users from "@/Models/Users";
import { Data, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        const {
            fileId,
            role,
            emailAddress
        } = await request.json();
        const drive = google.drive({ version: 'v3', auth: await auth(['https://www.googleapis.com/auth/drive.file']) });
        await drive.permissions.create({
            fileId,
            requestBody: {
                emailAddress,
                role,
                type: 'user'
            }
        })
        return NextResponse.json({ message: 'Access Granted!',status:'success' })
    } catch (error: any) {
        console.log((error as Data).message)
        return NextResponse.json({ error: 'Access Denied!',status:'error' }, { status: 500 })

    }
}