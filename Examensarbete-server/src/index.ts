import express from "express";
import mongoose from "mongoose";
import crypto from "node:crypto";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = 3000;
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

mongoose.connect("mongodb://localhost:27017/Examensarbete").then(() => {
  console.log("Connected");
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
let initVector = crypto.randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32);

let cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

let decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

io.on("connection", (socket) => {
  console.log("id:" + socket.id);
  io.emit("Key", Securitykey);

  socket.on("ClientSend", (message, iv) => {
    socket.broadcast.emit("ServerSend", message, iv);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//ej testad
function Decrypt(message: string, iv: crypto.BinaryLike) {
  decipher = crypto.createDecipheriv(algorithm, Securitykey, iv);

  let decryptedData = decipher.update(message, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
}

function Encrypt(message: string): Buffer {
  initVector = crypto.randomBytes(16);
  cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let data = [cipher.update(message, "utf-8"), cipher.final()];

  return Buffer.concat(data);
}
