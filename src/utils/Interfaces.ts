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
export interface FormFile {
    id: string;
    name: string;
    webViewLink: string;
    webContentLink: string;
}
export interface Data {
    // file?: FormFile ;
    [key: string]: string | string[] | boolean | React.ReactNode | object | File | Data;
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
    fields: FormField[],
    sheetId: string;
    folderId: string
}

export interface FormField {
    key: string;
    value: string;
    type: string;
    placeholder: string;
    name: string;
    options: string[];
    required: boolean;
    maxFiles?: string | number
    fileType?: string
    specificFile?: boolean
}


export interface ListFiles {
    query?: {
        filter?: string;        // Alternative for params
        fileType?: 'files' | 'folder';     // Alternative for type
    }
}


export type DrivePermissionRole = 'reader' | 'commenter' | 'writer' | 'fileOrganizer' | 'organizer' | 'owner';

export interface GoogleDriveFile {
    id: string; // Unique identifier for the file
    name: string; // Name of the file
    mimeType: string; // MIME type of the file
    thumbnailLink?: string; // Link to a thumbnail image of the file
    webViewLink?: string; // Link to view the file in a web browser
    parents?: string[]; // List of parent folder IDs
    createdTime?: string; // Date and time the file was created
    modifiedTime?: string; // Date and time the file was last modified
    size?: number; // Size of the file in bytes
    iconLink?: string; // Link to an icon representing the file type
    shared?: boolean; // Whether the file is shared
    sharedWithMeTime?: string; // Date and time the file was shared with the user
    owners?: { // Information about the file's owners
        kind: string; // Type of resource
        id: string; // Owner's ID
        displayName: string; // Owner's display name
        emailAddress: string; // Owner's email address
    }[];
    webContentLink?: string; // Link to download the file
    trashed?: boolean; // Whether the file is in the trash
    version?: string; // The version of the file
    // Add more fields as needed based on your requirements
}

interface GoogleDriveResponse {
    files: GoogleDriveFile[];
}


interface TextItem {
    type: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    _id?: string;
}

export interface CertificateTemplate {
    _id: string;
    templateUrl: string;
    fields: TextItem[];
    createdAt: { $date: string };
    updatedAt: { $date: string };
    __v: number;
}