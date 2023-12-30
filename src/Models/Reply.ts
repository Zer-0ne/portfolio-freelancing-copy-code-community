import mongoose from "mongoose";
import { Schema } from "mongoose";

const replySchema = new Schema({
    commentId:{
        type:Schema.Types.ObjectId,
        ref:'comment'
    },
    reply:{
        type:String,
        required:[true,'Please enter your reply']
    }
})
export default mongoose.models.Reply || mongoose.model("Reply", replySchema);