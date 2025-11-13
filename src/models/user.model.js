import mongoose, { version } from "mongoose";
import { USER_ROLES } from "../utils/constants.js";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            match: [
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores',
            ],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please enter a valid email address',
            ],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES) ,
            default: USER_ROLES.USER,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.pre('save', function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }

});

const User = mongoose.model("User", userSchema);

export default User;