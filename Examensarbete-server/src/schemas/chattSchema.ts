import mongoose, { InferSchemaType } from "mongoose";
import { messageModel, messageSchema } from "./messageSchema";

const chattSchema = new mongoose.Schema({
  users: { type: [mongoose.Types.ObjectId] },
  messages: { type: [messageSchema] },
});

export type chattModel = InferSchemaType<typeof chattSchema>;

export default mongoose.model("chattSchema", chattSchema);
