import mongoose, { Schema, Document } from "mongoose";

// Certificate ka interface define karein
interface CertificateDocument extends Document {
    date: Date;
    user: mongoose.Schema.Types.ObjectId; // User reference
    eventName: string;
    template: mongoose.Schema.Types.ObjectId; // Template reference
    category: string;
    name: string
}

// Certificate Schema
const CertificateSchema = new Schema<CertificateDocument>(
    {
        date: {
            type: Date,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventName: {
            type: String,
            required: true,
        },
        template: {
            type: Schema.Types.ObjectId,
            ref: "Certificatetemplate",
            required: true,
        },
        category: {
            type: String,
            default: "participate", // Default category
            enum: ['participate', 'appreciation', "achievement",
                "completion",
                "excellence", 'participation'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Certificate || mongoose.model<CertificateDocument>("Certificate", CertificateSchema);
