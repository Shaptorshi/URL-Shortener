import mongoose, { Document, Schema } from 'mongoose';

export interface userType extends Document {
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema<userType>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 8
        },
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model<userType>("user",userSchema);