import connect from "@/utils/database";
import { NextResponse } from "next/server";


export const GET = async () => {
    await connect();
    return NextResponse.json({ 'message': 'hi' })
}