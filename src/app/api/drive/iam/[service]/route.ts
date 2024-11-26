
import { Data } from "@/utils/Interfaces";
import { auth } from "@root/sheets.config";
import { google, } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// let private = ''


export const GET = async (request: NextRequest, { params }: any) => {
    const { service } = params;
    console.log(service)
    try {
        // private = data?.privateKeyData as string
        return NextResponse.json({
            data: ''
        });
    } catch (error) {

        return NextResponse.json({ error: (error as Data).message })
    }
}


export const POST = async (request: NextRequest, { params }: any) => {
    const { service } = params;

    try {
        // const list = await getListOfKeys(service)
        // const credentials = list && await getSpecificKey(list[0]?.name as string) // return public key
        // console.log(credentials)
        // console.log(list)
        // const name = await (list as any)?.keys[0].name

        return NextResponse.json({
            credentials: ''
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Data).message })
    }
}