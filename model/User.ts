import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date
}

const MesseageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verificationCode: string;
    verificationCodeExpiry: Date;
    isVerified: boolean;
    isMessageAccpet: boolean;
    createdAt: Date;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match:[/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: [true, 'Code is required'],
    },
    verificationCodeExpiry: {
       type: Date,
       required: true
    },
    isMessageAccpet:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    messages: [MesseageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;