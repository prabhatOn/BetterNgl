import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true 
    },
    createdAt: { 
        type: Date,
        required: true, 
        default: Date.now 
    }
});
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"]
    },    
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, "Verification code expiration date is required"]
    },
    isAcceptingMessage: {
        type: Boolean,  
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User", UserSchema);

export default UserModel;