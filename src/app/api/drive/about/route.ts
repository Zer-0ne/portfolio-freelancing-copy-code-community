import Users from "@/Models/Users";
import { Data, ListFiles, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export const POST = async (request: NextRequest) => {
    try {
        // console.log(await currentSession())
        // const session = (await currentSession()) as Session;
        // if (!session) {
        //     return NextResponse.json(
        //         { message: "Please login", status: "error" },
        //         { status: 401 }
        //     );
        // }
        // const user = await Users.findOne({ username: session?.user?.username })

        // if (['user'].includes(user?.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        const {
            fields
        } = await request.json();
        // console.log(query)

        const drive = google.drive({
            version: "v3",
            auth: await auth([
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.appdata",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/drive.meet.readonly",
                "https://www.googleapis.com/auth/drive.metadata",
                "https://www.googleapis.com/auth/drive.metadata.readonly",
                "https://www.googleapis.com/auth/drive.photos.readonly",
                "https://www.googleapis.com/auth/drive.readonly"
            ]),
        });
        const {data} = await drive.about.get({
            fields
        });

        return NextResponse.json({
            data,
            status: "success",
        });
    } catch (error) {
        console.error("Error listing the file:", (error as Data).message);
        return NextResponse.json(
            { error: "Something went wrong!", status: "error" },
            { status: 500 }
        );
    }
};

