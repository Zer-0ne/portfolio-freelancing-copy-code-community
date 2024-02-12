import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis'
// import Auth from '@/auth.json'

// create event
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // request from the client 
        const {
            email, name, collegeName, course, courseYear, roles, skills, resume
        } = await request.json();

        const auth = await google.auth.getClient({
            credentials: {
                type: "service_account",
                private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_SHEET_CLIENT_ID,
                token_url: "https://oauth2.googleapis.com/token",
                universe_domain: "googleapis.com",
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })

        const sheets = google.sheets({ version: "v4", auth });
        let values = [
            [
                session.user.email, email, name, collegeName, course, courseYear, roles, skills, resume
            ],
            // Additional rows ...
        ];
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId: '1n60nsBS4hbFZdrsaJQ_cY0U3ZTPmCRxWPDJTvxAYMgM',
            range: `A2:I2`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });
        return NextResponse.json({ message: 'created secussfully', data: result.data })
    } catch (err: {
        message: string
    } | any) {
        console.log(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
