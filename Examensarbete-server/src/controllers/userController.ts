import mongoose, { TypeExpressionOperator, Types } from "mongoose";
import bcrypt from "bcrypt";
import user from "../schemas/userSchema.js";
import chatt from "../schemas/chattSchema.js";

export function addUser(namein: string, emailin: string, passwordin: string) {
  return new Promise<void>((reject, resolve) => {
    user
      .create({
        name: namein,
        email: emailin,
        password: saltAndHash(passwordin),
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });

  function saltAndHash(noHash: string) {
    return new Promise<string>((resolve, reject) => {
      const hash = bcrypt.hash(noHash, 10, function (error, hash) {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    });
  }
}

export function ueserLogin(
  password: string,
  namein?: string,
  emailin?: string
) {
  return new Promise<string>((resolve, reject) => {
    if (namein) {
      user
        .find({ name: namein })
        .then((users) => {
          users.forEach(async (user) => {
            if (await comparePassword(password, user.password as string)) {
              resolve(user.id);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    }
    if (emailin) {
      user
        .find({ email: emailin })
        .then((users) => {
          users.forEach(async (user) => {
            if (await comparePassword(password, user.password as string)) {
              resolve(user.id);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    }
  });

  async function comparePassword(plaintextPassword: string, hash: string) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }
}

export function sendMessages(
  userId: mongoose.Types.ObjectId,
  message: String,
  chattId: mongoose.Types.ObjectId
) {
  return new Promise<void>(async (resolve, reject) => {
    let currentChatt = await chatt.findById(chattId);
    if (!currentChatt) {
      reject("No chatt with provided id");
      return;
    }
    let sendUser = await user.findById(userId);
    if (!sendUser) {
      reject("No user with provided id");
      return;
    }
    let newMessage = {
      fromUser: userId,
      message: message,
    };
    currentChatt.messages.push(newMessage);
    currentChatt.save().catch((err) => {
      reject(err);
    });
    resolve();
  });
}
