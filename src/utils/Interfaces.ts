import mongoose, { Schema } from "mongoose";

export interface navbar {
    name: string;
    icon: React.ReactNode;
}[]
export interface coreMember {
    name: string;
    role: string;
    image: string
    LinkedIn: string;
    GitHub: string;
    bio: string
    email: string;
};
export interface EventsInterface {
    heading: string,
    description: string,
    headingDate: string,
    calenderDate: string,
    tag: string,
    mode: string,
    participants: number,
    status: string,
    image: string;
    label?: string
};

export interface BlogsInterface {
    heading: string;
    description: string;
    date: string;
    tag: string;
}

export interface UserDocument {
    name: string;
    password: string;
    email: string;
    username: string
    isAdmin: boolean;
    followings: {
        userId: {
            type: typeof Schema.Types.ObjectId;
            ref: String;
        }
    }[];
    followers: {
        userId: {
            type: typeof Schema.Types.ObjectId;
            ref: String;
        }
    }[];
    profile: {
        type: string;
        required: boolean;
    },
    saved?: mongoose.SchemaDefinitionProperty<string[]>
}

export interface Data {
    [key: string]: string;
}

export interface InputToMoveCursor {
    focus: () => void;
    setSelectionRange: (_1: number, _2?: number) => void;
    value: {
        length: number
    }
}