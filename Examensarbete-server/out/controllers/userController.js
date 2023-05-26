import bcrypt from "bcrypt";
import user from "../schemas/userSchema.js";
import chatt from "../schemas/chattSchema.js";
export function addUser(namein, emailin, passwordin) {
    return new Promise((reject, resolve) => {
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
    function saltAndHash(noHash) {
        return new Promise((resolve, reject) => {
            const hash = bcrypt.hash(noHash, 10, function (error, hash) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(hash);
                }
            });
        });
    }
}
export function ueserLogin(password, namein, emailin) {
    return new Promise((resolve, reject) => {
        if (namein) {
            user
                .find({ name: namein })
                .then((users) => {
                users.forEach(async (user) => {
                    if (await comparePassword(password, user.password)) {
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
                    if (await comparePassword(password, user.password)) {
                        resolve(user.id);
                    }
                });
            })
                .catch((error) => {
                reject(error);
            });
        }
    });
    async function comparePassword(plaintextPassword, hash) {
        const result = await bcrypt.compare(plaintextPassword, hash);
        return result;
    }
}
export function sendMessages(userId, message, chattId) {
    return new Promise(async (resolve, reject) => {
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
