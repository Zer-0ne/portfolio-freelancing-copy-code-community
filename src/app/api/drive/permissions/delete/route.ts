import Users from "@/Models/Users";
import { Data, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login', status: 'error' }, { status: 401 })
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })
        const {
            fileId,
            permissionId
        } = await request.json();
        const drive = google.drive({ version: 'v3', auth: await auth(['https://www.googleapis.com/auth/drive.file']) })
        await drive.permissions.delete({
            fileId
            ,permissionId
        })       
        return NextResponse.json({ message:'Access Removed', status: 'success' })

    } catch (error) {
        console.log('From list the permissions :: '+(error as Data).message)
        return NextResponse.json({ error: 'Access Denied!', status: 'error' }, { status: 500 })
    }
}