import { listFiles } from "@/utils/Google-Apis";
import Users from "@/Models/Users";
import { Data, ListFiles, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 1;

export const POST = async (request: NextRequest) => {
    try {
        // console.log(await currentSession())
        const session = (await currentSession()) as Session;
        if (!session) {
            return NextResponse.json(
                { message: "Please login", status: "error" },
                { status: 401 }
            );
        }
        const user = await Users.findOne({ username: session?.user?.username })

        if (['user'].includes(user?.role)) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        const {
            query
        }: ListFiles = await request.json();
        // console.log(query)

        const data = await listFiles({
            query
        } as {
            query: ListFiles
        })
        if (!data) {
            throw new Error('Something went wrong!');
        }
        return NextResponse.json({
            data: {
                ...data,
                status: "success"
            },
        });
    } catch (error) {
        console.error("Error listing the file:", (error as Data).message);
        return NextResponse.json(
            { error: "Something went wrong!", status: "error" },
            { status: 500 }
        );
    }
};

