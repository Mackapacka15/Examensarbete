import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate: {
            function(v) {
                return validator.isEmail(v);
            },
        },
    },
    password: { type: String },
    chatts: { type: [mongoose.Types.ObjectId] },
    friends: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                userId: { type: mongoose.Types.ObjectId, required: true },
            },
        ],
    },
});
export default mongoose.model("userSchema", userSchema);
