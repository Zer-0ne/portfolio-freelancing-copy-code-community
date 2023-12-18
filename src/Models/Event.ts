import mongoose, { Schema } from "mongoose"

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    tag: String,
    mode: {
        type: String,
        required: [true, 'Please add mode']
    },
    participants: {
        type: Number,
        required: [true, 'Please add participants']
    },
    status: {
        type: String,
        required: [true, 'Please add status']
    },
    image: {
        type: String,
        required: [true, 'Please add image']
    },
    label: String,
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    authorId: {
        type: String,
        required: true
    },
    contentImage: Array,
    date: {
        type: Date,
        required: [true, 'Please add organized date']
    }
}, {
    timestamps: true
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);