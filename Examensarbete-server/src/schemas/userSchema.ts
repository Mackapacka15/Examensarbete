import mongoose, { InferSchemaType, Mongoose } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      function(v: string) {
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

export type userModel = InferSchemaType<typeof userSchema>;

export default mongoose.model("userSchema", userSchema);
