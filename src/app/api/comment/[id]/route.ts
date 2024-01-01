import Comment from "@/Models/Comment";
import Users from "@/Models/Users";
import { userInfo } from "@/utils/FetchFromApi";
import { CommentInterface, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

// fetching the one or multiply comment
export const GET = async (request: NextRequest, { params }: any) => {
    try {
        await connect();
        const { id } = params;
        const array = id.split(',')
        const comment: string[] = [];
        // if (!id) return new Comment().getAllComments(); // get all comments
        for (const singleId of array) {
            const res = await Comment.findById(singleId)
            let author = await Users.findById(res.authorId);
            const { password, ...userWithoutPassword } = author.toObject();
            const {
                authorId,
                ...other
            } = await res.toObject()
            comment.push({
                ...other,
                authorId: {
                    ...userWithoutPassword
                }
            })
        }
        return NextResponse.json(comment)
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// delete one comment
export const DELETE = async (request: NextRequest, { params }: any) => {
    try {
        const { id } = params
        const { userId } = await request.json()

        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user?.isAdmin === false || session.user.id == userId) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        // connect to Database
        await connect();
        const deleteComment = await Comment.findByIdAndDelete(id) as unknown as CommentInterface


        if (!deleteComment) return NextResponse.json({ message: 'Comment not found!' }, { status: 400 })

        return NextResponse.json({ message: 'Delete seccussfully' })

    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// edit blog
export const PUT = async (request: NextRequest, { params }: any) => {
    try {
        const {
            comment, userId, blogId, eventId, replies
        } = await request.json();
        // check the session
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user?.isAdmin === false || user.id !== userId) return NextResponse.json({ message: 'Your are not Authorized!' }, { status: 401 })

        // connect to Database
        await connect();
        const updateComment = {
            comment, userId, blogId, eventId, replies
        }
        const { id } = params
        const blog = await Comment.findByIdAndUpdate(
            id,
            { $set: updateComment },
            { new: true }
        );
        if (!blog) return NextResponse.json({ message: 'Comment not found!' }, { status: 400 })
        return NextResponse.json({ message: 'Comment updated!' })
    } catch (err: {
        message: string
    } | any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}