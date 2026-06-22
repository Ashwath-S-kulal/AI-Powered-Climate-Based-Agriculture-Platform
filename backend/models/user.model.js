import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/business-man-avatar-profile_1133257-2431.jpg?semt=ais_hybrid&w=740&q=80",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;