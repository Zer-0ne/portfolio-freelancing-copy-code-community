import { UserDocument } from "@/utils/Interfaces"
import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    followings: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User" as String,
            }
        }
    ],
    followers: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User" as String,
            }
        }
    ],
    saved: {
        type: [Schema.Types.ObjectId],
        ref: 'Blog',
        default: [],
    },
    profile: String
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);