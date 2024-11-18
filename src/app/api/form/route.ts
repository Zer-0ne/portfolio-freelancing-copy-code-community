import { Data, EventsInterface, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from "gaxios";
import Event from "@/Models/Event";
import { monthName } from "@/utils/constant";

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
            const data = { name: this.name, id: `${id}`, title: this.title, email: this.email, password: process.env.EMAIL_PASS, date: `${monthName[new Date().getMonth()]} ${new Date().getDate()},${new Date().getFullYear()}` }

            const response = await fetch(`${process.env.FLASK_URL}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                })
            })
            const res = await response.json()
            return res.status
        } catch (error: any) {
            return NextResponse.json({ message: error.message, status: 500 }, { status: 500 })
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
            sequence,
            title, // this is only for create a new sheet for name the title  of the sheet
            sheetId, // this is for update specific sheet
        } = await request.json();
        // console.log(fields)

        function joinArrays(data: Data) {
            const result: Data = {};

            for (const key in data) {
                if (Array.isArray(data[key])) {
                    // Join the array into a string, you can specify a separator if needed
                    result[key] = data[key].join(' '); // Joining with a comma and space
                } else {
                    result[key] = data[key]; // Keep non-array values as they are
                }
            }

            return result;
        }

        // Create a new object based on the desired order
        const orderedData: Data = {};

        // Reorder the data object based on the desired order
        sequence?.forEach((field: string) => {
            if (fields[field] !== undefined) {
                orderedData[field] = fields[field];
            }
        });

        // Now, update the original data object
        Object.keys(fields).forEach(key => {
            delete fields[key]; // Clear the original data object
        });

        // Assign the ordered data back to the original data object
        Object.assign(fields, orderedData);

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
                session.user.email, ...Object.values(joinArrays(fields)) as string[]
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
            const res = await certificates.generate(id)
            values[0] = [`${id}`].concat(values[0])
            if (res !== '200') {
                return NextResponse.json({ message: 'Something went wrong', status: 'error' }, { status: 500 })
            }
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
