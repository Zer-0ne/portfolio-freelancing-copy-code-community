'use server'
import { NextResponse } from "next/server";


export const GET = async () => {
    return NextResponse.json({ error: 'hi' }, { status: 500 })
}