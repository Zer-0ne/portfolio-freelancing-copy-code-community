import { Data, EventsInterface, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import { google, sheets_v4 } from 'googleapis'
import { PythonShell } from 'python-shell';
import { GaxiosResponse } from "gaxios";
import path from 'path'
import Event from "@/Models/Event";
const scriptPath = path.resolve(__dirname, '../python/main.py');

// get post 
export const GET = async () => {
    try {
        // const session = await currentSession() as Session;
        // if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 });
        // const oauth = new google.auth.OAuth2(
        //     process.env.GOOGLE_CLIENT_ID,
        //     process.env.GOOGLE_CLIENT_SECRET,
        //     'http://localhost:3000/api/auth/callback/google'
        // )


        // const auth = oauth.generateAuthUrl({
        //     access_type: 'offline',
        //     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        //     include_granted_scopes: true
        // })
        // const sheets = google.sheets({ version: "v4", auth });
        // return NextResponse.json({
        //     message: 'created secussfully', data: await sheets.spreadsheets.values.get({
        //         spreadsheetId: '10PwEc8qTzOagMpzpLMEWyfJvyRaZXhW2f6rqMcq5EWM',
        //         range: 'A:Z'
        //     })
        // })


        return NextResponse.json({ meee: '' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error })
    }
}


// create certificate and send to the image of user
class HandleCertificate {
    name: string;
    title: string;
    email: string
    constructor(name: string, title: string, email: string) {
        this.name = name;
        this.title = title;
        this.email = email
    }
    generate = async (id: number) => {
        try {
            let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                args: [this.name, `${id}`, this.title, this.email,process.env.EMAIL_PASS]
            };
            await PythonShell.run(scriptPath.replace('[project]', ''), options as any).then(messages => {
                if (['Thank you for interest! Check your mailbox.'].includes(messages[0])) {

                }
            });
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 })
        }
    }
}


// create post
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // request from the client 
        const {
            functionality,
            fields,
            title, // this is only for create a new sheet for name the title  of the sheet
            sheetId, // this is for update specific sheet
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
                session.user.email, ...Object.values(fields) as string[]
            ],
            // Additional rows ...
        ];
        if (fields['certificate']) {
            const today = new Date(); // This will get the current date

            const todayEvents = (await Event?.find({}))?.filter((event: EventsInterface) => {
                const eventDate = new Date(event.eventDate);
                return (
                    eventDate.getDate() === today.getDate() &&
                    eventDate.getMonth() === today.getMonth() &&
                    eventDate.getFullYear() === today.getFullYear()
                );
            })
                .map(({ title }: { title: string }) => title);
            if ([fields['certificate']].includes(todayEvents)) return NextResponse.json({ message: 'There is no active event', status: 'error' })
            const id = Date.now()
            const certificates = new HandleCertificate(fields['Name'], fields['certificate'], session.user.email);
            await certificates.generate(id)
            values[0] = [`${id}`].concat(values[0])

        }
        const option: {
            create: GaxiosResponse<sheets_v4.Schema$Spreadsheet>,
            update: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse>
        } = {
            create: await sheets.spreadsheets.create({
                requestBody: {
                    properties: {
                        title,
                    }
                },
                // auth: 
            }),
            update: sheetId && await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId && sheetId,
                range: 'A2:Z2',
                valueInputOption: "USER_ENTERED",
                requestBody: { values }
            })
        }


        const result = (functionality in option) && await option[functionality as keyof typeof option].data
        return NextResponse.json({ message: 'created secussfully', data: result, status: 'success' })
    } catch (err: {
        message: string
    } | any) {
        console.log(err)
        return NextResponse.json({ error: err.message, status: 'error' }, { status: 500 })
    }
}
