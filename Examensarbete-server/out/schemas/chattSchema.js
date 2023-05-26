import mongoose from "mongoose";
import { messageSchema } from "./messageSchema";
const chattSchema = new mongoose.Schema({
    users: { type: [mongoose.Types.ObjectId] },
    messages: { type: [messageSchema] },
});
export default mongoose.model("chattSchema", chattSchema);
