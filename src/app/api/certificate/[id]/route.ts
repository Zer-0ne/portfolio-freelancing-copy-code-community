import Certificate from "@/Models/certificate";
import CertificateTemplate from "@/Models/CertificateTemplate";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: any) => {
    try {
        const { id } = params;

        // Find certificate by ID and populate user and template fields
        await connect();
        if (!id) {
            return NextResponse.json({ message: "Certificate ID is required" }, { status: 400 });
        }
        await CertificateTemplate.find(); // Ensure the template is loaded
        const data = await Certificate.findById(id)
            .populate('user') // Populate the user field
            .populate('template'); // Populate the template field

        if (!data) {
            return NextResponse.json({ message: "Certificate not found" }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(`Error in fetching the certificate :: ${(error as Error).message}`);
        return NextResponse.json({ message: "Error", error: (error as Error).message }, { status: 500 });
    }
};