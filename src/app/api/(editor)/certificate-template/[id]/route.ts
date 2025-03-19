import { NextRequest, NextResponse } from "next/server"
import CertificateTemplate from "@/Models/certificate-template";
import { currentSession } from "@/utils/Session";
import { Session } from "@/utils/Interfaces";

export const GET = async (request: NextRequest, { params }: any) => {
    try {
        const { id } = params;

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