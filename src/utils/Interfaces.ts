import mongoose, { Schema } from "mongoose";

export interface navbar {
    name: string;
    icon: React.ReactNode;
}[]
export interface coreMember {
    insta: string
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
    eventDate: string,
    tag: string,
    mode: string,
    contentImage: string[];
    participants: number,
    status: string,
    image: string;
    label?: string
    _id: string;
    updatedAt: string;
    content: string;
};

export interface BlogsInterface {
    title: string;
    description: string;
    updatedAt: string;
    contentImage: string[];
    authorId: string
    tag: string;
    comments: string[];
    _id: string;
    content: string;
}

export interface UserDocument {
    name: string;
    password: string;
    email: string;
    username: string
    isAdmin: boolean;
    role: string;
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
    certificate: string[]
    saved?: mongoose.SchemaDefinitionProperty<string[]>
}

export interface Data {
    [key: string]: string | string[] | boolean | React.ReactNode | object;
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

export interface User {
    email: string;
    _id: string;
    id: string;
    name: string;
    image: string;
    username: string;
    role: string;
}

export interface Session {
    expires: string;
    user: User
}

export interface CommentInterface {
    userId: string;
    _id: string;
    comment: string;
    blogId: string;
    eventId: string;
    updatedAt: string;
    createdAt: string;
    authorId: User;
}

export interface FormStructure {
    _id?: string;
    title: string
    subtitle: string;
    'Accepting Response': boolean;
    fields: [
        {
            key: string;
            value: string;
            type: string;
            placeholder: string;
            name: string
            options: string[];
            required: boolean;
        }
    ],
    sheetId: string;
}