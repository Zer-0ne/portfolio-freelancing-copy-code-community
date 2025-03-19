import Certificate from "@/Models/certificate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: any) => {
    try {
        const { id } = params;
        
        // Find certificate by ID and populate user and template fields
        const data = await Certificate.findById(id)
            .populate('user') // Populate the user field
            .populate('template'); // Populate the template field

        if (!data) {
            return NextResponse.json({ message: "Certificate not found" }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(`Error in fetching the certificate :: ${(error as Error).message}`);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
};