import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    content: {
        type: String
    }
}, {
    timestamps: true
});
export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
