// 'use server'

import mongoose, { Schema } from "mongoose"

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
    },
    tag: String,
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [
        {
            comment: {
                type: String
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            replies: [
                {
                    reply: {
                        type: String,
                    },
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                    },
                },
            ],

        }
    ],
    content: {
        type: String,
        required: [true, 'Please add a content']
    }
}, {
    timestamps: true
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);