import { Data, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

interface FileResource {
    name: string;
    mimeType: string;
    parents?: string[]; // Optional parent folder IDs
}

// Convert buffer to a readable stream
const bufferToStream = (buffer: Buffer): Readable => {
    const readable = new Readable();
    readable._read = () => { }; // _read is a no-op
    readable.push(buffer);
    readable.push(null); // Signal end of stream
    return readable;
};

export const revalidate = 60;

export const POST = async (request: NextRequest) => {
    try {
        const session = (await currentSession()) as Session;
        
        // Parse request data
        const { folderName, folderId, file, remainingUploads,isLoginRequired } = await request.json();
        // console.log(folderName, file)
        if (remainingUploads < 1) {
            return NextResponse.json(
                { message: "Upload limit exceeded. Consider removing some files to continue uploading.", status: "warning" },
                { status: 400 }
            );
        }
        console.log(!session && isLoginRequired)
        
        if (!session && isLoginRequired) {
            return NextResponse.json(
                { message: "Please login", status: "error" },
                { status: 401 }
            );
        }

        const drive = google.drive({
            version: "v3",
            auth: await auth([
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.appdata",
            ]),
        });

        if (!folderId && !file) {
            if (!folderName) {
                return NextResponse.json(
                    { message: "Folder name is required", status: "error" },
                    { status: 400 }
                );
            }
            // Step 1: Create the folder
            const folder = await drive.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: "application/vnd.google-apps.folder",
                } as FileResource,
                fields: "id", // Only return the ID
            });
            const folderId = folder.data.id; // Extract the folder ID
            if (!folderId) {
                throw new Error("Failed to create folder");
            }
            return NextResponse.json({
                folderId,
                message: "File Create successfully",
                status: "success",
            });
        }

        if (!file || !folderId) {
            return NextResponse.json(
                { message: "file are required", status: "error" },
                { status: 400 }
            );
        }
        // Step 2: Decode the Base64 file content
        const fileBuffer = Buffer.from(file?.content?.split(",")[1], "base64");

        // Step 2: Upload the file to the created folder
        const { data } = await drive.files.create({
            requestBody: {
                name: file?.name,
                parents: [folderId], // Use the folder ID here
            } as FileResource,
            media: {
                mimeType: file?.type,
                body: bufferToStream(fileBuffer), // Pass the file content
            },
            fields: "id, name", // Specify which fields to return
        });

        const fileId = data.id;
        if (!fileId) throw new Error("Failed to upload file");

        // Step 3: Set permissions to make the file accessible
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader", // Can be "reader", "writer", etc.
                type: "anyone", // Can be "user", "group", "domain", or "anyone"
            },
        });

        // Step 4: Get the file link
        const fileDetails = await drive.files.get({
            fileId,
            fields: "webViewLink, webContentLink", // Links to view and download
        });

        return NextResponse.json({
            data: {
                ...data,
                parentFolder: folderId,
                webViewLink: fileDetails.data.webViewLink, // Viewable link
                webContentLink: fileDetails.data.webContentLink, // Downloadable link
            },
            message: "File uploaded successfully",
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