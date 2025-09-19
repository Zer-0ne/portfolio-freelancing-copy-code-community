import Users from "@/Models/Users";
import { Data, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export const GET = async (request: NextRequest, { params }:  any) => {
    try {
        const session = (await currentSession()) as Session;
        if (!session) {
            return NextResponse.json(
                { message: "Please login", status: "error" },
                { status: 401 }
            );
        }
        

        // Parse request data
        const { fileId } = params;


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

        // Step 1: Create the folder
        const data = await drive.files.get({
            fileId
        })

        return NextResponse.json({
            data,
            status: "success",
        });
    } catch (error) {
        console.error("Error uploading file:", (error as Data).message);
        return NextResponse.json(
            { error: "Something went wrong!", status: "error" },
            { status: 500 }
        );
    }
};
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        const { fileId: rawFileId } = params;
        const [fileId, isLoginRequiredSuffix] = rawFileId.split(':-isVerifiedUser-:');
        const isLoginRequired = isLoginRequiredSuffix ?? 'true'; // default to true if missing
        console.log({ fileId, isLoginRequired });

        // Session fetch
        const session = (await currentSession()) as Session;

        // Check session only if required
        if (isLoginRequired === 'true' && !session) {
            return NextResponse.json(
                { message: "Please login", status: "error" },
                { status: 401 }
            );
        }

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

        // Delete the file from Drive
        await drive.files.delete({
            fileId: fileId
        });

        return NextResponse.json({
            message: 'Deleted!',
            status: "success",
        });
    } catch (error) {
        console.error("Error deleting file:", (error as Data).message);
        return NextResponse.json(
            { error: "Something went wrong!", status: "error" },
            { status: 500 }
        );
    }
};


