import mongoose, { InferSchemaType } from "mongoose";

export const messageSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Types.ObjectId },
  message: { type: String },
});

export type messageModel = InferSchemaType<typeof messageSchema>;
