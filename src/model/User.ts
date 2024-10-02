import mongoose, { Schema, Document } from 'mongoose';

// Message interface and schema
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Message content is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// User interface and schema
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string | null;
    verifyCodeExpiry: Date | null;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        default: null,  // Allow null after verification or password reset
    },
    verifyCodeExpiry: {
        type: Date,
        default: null,  // Allow null after verification or password reset
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});

// Prevent overwriting the model in hot-reloading scenarios (common in Next.js)
const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);

export default UserModel;
