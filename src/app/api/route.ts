'use server'
import { currentSession } from "@/utils/FetchFromApi";
import connect from "@/utils/database";
import { NextResponse } from "next/server";


export const GET = async () => {
    await connect();
    const session = await currentSession();
    console.log(session)
    return NextResponse.json({ error: 'hi' }, { status: 500 })
}