import mongoose from "mongoose";
export const messageSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Types.ObjectId },
    message: { type: String },
});
