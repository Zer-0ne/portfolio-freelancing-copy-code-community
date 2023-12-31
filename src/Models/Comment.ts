import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'Please enter your comment']
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    replies: [
        {
            type: Schema.Types.ObjectId
        }
    ]
})

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
