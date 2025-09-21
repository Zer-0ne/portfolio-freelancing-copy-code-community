import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from '@root/sheets.config';
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import Users from "@/Models/Users";

/**
 * 
 * @param request 
 * @param param1 
 * @returns 
 * 1. check the session 
 * 2. check current user have authority or not?
 * 3. authentic with google drive
 * 4. delete the google sheet 
 */
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })
        // check the user is admin and moderator or not 
        const user = await Users.findOne({ username: session?.user?.username })
        if (['user'].includes(user?.role)) return NextResponse.json({ message: 'Your are not Authorized!', status: 'error' }, { status: 401 })
        const { id } = await params;
        const drive = google.drive({ version: 'v3', auth: await auth() });
        await drive.files.delete({ fileId: id });
        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE handler:", error.message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * 1. check the current user are authorized or not
 * 2. authenticate the google drive
 * 3. get the sheet and convert into array buffer
 * 4. and response to the client side
 * @param request recive the data from the client side
 * @param param1 get the id from the routes in next router
 * @returns return the response of data 
 */
export const GET = async (request: NextRequest, { params }: any) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 });

        // Check if the user is an admin or moderator
        const user = await Users.findOne({ username: session?.user?.username });
        if (['user'].includes(user?.role)) return NextResponse.json({ message: 'You are not authorized!', status: 'error' }, { status: 401 });

        const { id } = params;
        const drive = google.drive({ version: 'v3', auth: await auth() });

        // Export the Google Sheet as an Excel file
        const response = await drive.files.export({
            fileId: id,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }, { responseType: 'arraybuffer' });

        // Prepare and send the binary file directly in the response
        const excelBuffer = Buffer.from(response.data as ArrayBuffer);
        return new NextResponse(excelBuffer as any, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="spreadsheet.xlsx"`,
            },
            status: 200
        });
    } catch (error: any) {
        console.error("Error downloading sheet:", error.message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}