import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface urlType extends Document {
    originalUrl: string,
    shortCode: string,
    clicks: number,
    userId:ObjectId,
    expiresAt?: Date,
    createdAt: Date,
    updatedAt: Date
}

const urlSchema = new Schema<urlType>({
    originalUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        unique: true,
        required: true
    },
    clicks: {
        type: Number,
        default: 0,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:false
    },
    expiresAt: {
        type: Date,
    }
},
    {
        timestamps: true
    }
)

export const Url = mongoose.model<urlType>("URL",urlSchema);