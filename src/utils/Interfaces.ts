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
    title: string,
    description: string,
    headingDate: string,
    calenderDate: string,
    tag: string,
    mode: string,
    contentImage: string[];
    participants: number,
    status: string,
    image: string;
    label?: string
    _id: string
};

export interface BlogsInterface {
    title: string;
    description: string;
    updatedAt: string;
    contentImage: string[];
    tag: string;
    _id: string
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
    image: {
        type: string;
        required: boolean;
    },
    saved?: mongoose.SchemaDefinitionProperty<string[]>
}

export interface Data {
    [key: string]: string | string[];
}

export interface InputToMoveCursor {
    focus: () => void;
    setSelectionRange: (_1: number, _2?: number) => void;
    value: {
        length: number
    }
}

export interface Item {
    icon: (type?: boolean | undefined, item?: Data) => React.JSX.Element;
    name: string;
    toMoveCursor: number;
    code: () => string;
    type: (isTrue?: boolean) => boolean;
}

export interface Session {
    expires: string;
    user: {
        email: string;
        id: string;
        name: string;
        image: string;
        username: string
    }
}