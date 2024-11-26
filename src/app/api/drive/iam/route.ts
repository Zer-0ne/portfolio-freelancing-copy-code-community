import { Data } from "@/utils/Interfaces";
import { auth } from "@root/sheets.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {

        return NextResponse.json({ data: 'response' })
    } catch (error) {
        return NextResponse.json({ data: (error as Data).message })
        // throw error.message;
    }
}

export const GET = async () => {
    try {



        // const { data } = await service_usage.services.list({
        //     parent: `projects/${projectId}`,
        //     auth: await auth(['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/cloud-platform.read-only']),
        // });
        // const services = data.services;
        // if (services) {
        //     for (const service of services) {
        //         console.log(`Service: ${service.name}`);
        //         console.log(`  Title: ${service.config.title}`);
        //         console.log(`  State: ${service.state}`);
        //         // You can add more details as needed
        //     }
        // }
        // const data = await LimitOfServiceAccount();
        return NextResponse.json({ data:'' })
    } catch (error) {
        console.error('Error creating service account:', (error as Data).message);
        return NextResponse.json({ data: (error as Data).message })
        // throw error.message;
    }
}