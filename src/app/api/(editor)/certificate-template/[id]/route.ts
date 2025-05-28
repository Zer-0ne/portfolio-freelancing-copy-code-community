import { NextRequest, NextResponse } from "next/server"
import { currentSession } from "@/utils/Session";
import { Session } from "@/utils/Interfaces";
import CertificateTemplate from "@/Models/certTemplate";

export const GET = async (request: NextRequest, { params }: any) => {
    try {
        const { id } = await params;

        if (!id) {
            return new Response(JSON.stringify({ error: "ID is required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const data = await CertificateTemplate.findById(id)
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.log(`Error in fetching the template of certicate :: ${(error as Error).message}`)
        return NextResponse.json({ message: 'Something Went Wrong!' }, { status: 500 })
    }
}

export const PUT = async (request: NextRequest, { params }: any) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        /**
         * TODO: validation for admin and moderator and editor can do this
         */

        const { id } = await params;

        const data = await request.json();
        const { _id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
        }

        const updatedTemplate = await CertificateTemplate.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTemplate) {
            return NextResponse.json({ message: 'Certificate template not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Updated successfully!',
            template: updatedTemplate
        }, { status: 200 });
    } catch (error) {
        console.log(`Error in updating the template of certificate :: ${(error as Error).message}`);
        return NextResponse.json({ message: 'Something Went Wrong!' }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        console.log('tessting delete');
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, {
            status:
                401
        })
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'Certificate ID is required' }, {
                status: 400
            });
        }
        const deletedTemplate = await CertificateTemplate.findByIdAndDelete(id);
        if (!deletedTemplate) {
            return NextResponse.json({ message: 'Certificate template deleted' }, { status: 404 });
        }
        // Extract the file path from the template URL
        const templateUrl = deletedTemplate.templateUrl;
        const decodedUrl = decodeURIComponent(templateUrl);
        const match = decodedUrl.match(/\/o\/(.*?)\?alt/);
        if (match && match[1]) {
            const filePath = match[1]; // e.g., 'Thumbnails/certificates/filename.png'
            const { storage } = await import('@/utils/Firebase');
            const { ref, deleteObject } = await import('firebase/storage');
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
        }
        return NextResponse.json({ message: 'Certificate template deleted successfully' }, { status: 200 });
    } catch (error) {
        console.log(`Error in deleting the template of certificate :: ${(error as Error).message}`);
        return NextResponse.json({ message: 'Something Went Wrong!' }, { status: 500 });
    }
}