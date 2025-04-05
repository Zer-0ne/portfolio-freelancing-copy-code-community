import { Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import CertificateTemplate from "@/Models/certificateTemplate";

export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        /**
         * TODO: validation for admin and moderator and editor can do this
         */

        const data = await request.json()
        await CertificateTemplate.create(data);
        return NextResponse.json({ message: 'Created successfully!' }, { status: 200 })
    } catch (error) {
        console.log(`Error in creating the template of certicate :: ${(error as Error).message}`)
        return NextResponse.json({ message: 'Something Went Wrong!' }, { status: 500 })
    }
}

export const GET = async () => {
    try {
        const data = await CertificateTemplate.find()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.log(`Error in fetching the template of certicate :: ${(error as Error).message}`)
        return NextResponse.json({ message: 'Something Went Wrong!' }, { status: 500 })
    }
}

export const PUT = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        /**
         * TODO: validation for admin and moderator and editor can do this
         */

        const data = await request.json();
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
        }

        const updatedTemplate = await CertificateTemplate.findByIdAndUpdate(
            _id,
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