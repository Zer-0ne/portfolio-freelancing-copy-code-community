import { UserDocument } from "@/utils/Interfaces"
import mongoose, { Schema } from "mongoose"

const certificateTemplateSchema = new Schema({
    templateUrl: {
        type: String,
        required: true
    },
    fields: [
        {
            type: {
                type: String,
                enum: ['custom', 'qrcode', 'description'],
                required: true
            },
            descriptions: {
                type: Object,
                default: {}
            },
            text: {
                type: String,
                // required: true
            },
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            },
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            },
            fontSize: {
                type: Number,
                // required: true
            },
            fontFamily: {
                type: String,
                // required: true
            },
            fontWeight: {
                type: String,
                enum: ['normal', 'bold', 'lighter', 'bolder'],
                // required: true
            },
            color: {
                type: String,
                // required: true
            },
            textAlign: {
                type: String,
                enum: ['left', 'right', 'center', 'justify'],
                // required: true
            }
        }
    ]
}, {
    timestamps: true
});


// export default mongoose.models.CertificateTemplate || mongoose.model<any>('Certificatetemplate', certificateTemplateSchema);
const CertificateTemplate = mongoose.models.Certificatetemplate ||
    mongoose.model('Certificatetemplate', certificateTemplateSchema);

export default CertificateTemplate;