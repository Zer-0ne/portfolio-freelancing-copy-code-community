import { UserDocument } from "@/utils/Interfaces"
import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: [true, 'Please add name']
    },
    username: {
        type: String,
        required: [true, 'Please add username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add password']
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true
    },
    role: {
        type: String,
        default: 'user'
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
    image: String
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);