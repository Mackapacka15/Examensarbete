<script setup lang="ts">
import { ref } from "vue";
import { io } from "socket.io-client";
const socket = io("ws://localhost:3000");

type Message = {
  message: string;
  timeSent: Date;
  sender: string;
};

let messages = ref([] as Message[]);
let message = ref("");

let key: CryptoKey;

socket.on("connect", () => {
  console.log(`You connected with id: ${socket.id} `);
});
socket.on("ServerSend", async (message: ArrayBuffer, iv: ArrayBuffer) => {
  messages.value.push(await decryptMessage(message, iv));
});
socket.on("Key", async (message: ArrayBuffer) => {
  key = await createKey(message);
});

function createKey(rawKey: ArrayBuffer) {
  return window.crypto.subtle.importKey("raw", rawKey, "AES-CBC", true, [
    "encrypt",
    "decrypt",
  ]);
}

async function EncryptAndSend(message: string) {
  var startTime = performance.now();

  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let encoder = new TextEncoder();
  //console.log(iv);

  let encrypted = window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    key,
    encoder.encode(message)
  );

  var endTime = performance.now();

  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

  socket.emit("ClientSend", await encrypted, iv);
}

async function decryptMessage(
  message: ArrayBuffer,
  iv: ArrayBuffer
): Promise<Message> {
  let decoder = new TextDecoder();
  let temp = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    message
  );
  return {
    message: decoder.decode(temp),
    timeSent: new Date(),
    sender: "Someone",
  };
}

function sendMessage() {
  messages.value.push({
    message: message.value,
    timeSent: new Date(),
    sender: "You",
  });
  EncryptAndSend(message.value);
  message.value = "";
}
</script>

<template>
  <div class="message-input-container">
    <form @submit.prevent="sendMessage()">
      <input
        class="message-input"
        type="text"
        id="textInput"
        v-model="message"
        placeholder="Message"
      />
      <button class="submit-button" type="submit">✉️</button>
    </form>
  </div>
  <div class="messages-container">
    <div class="message-container" v-for="message in messages">
      <div class="sender-time">
        <span>{{ message.sender }}, </span>
        <span>
          at {{ message.timeSent.getHours() }}:{{
            message.timeSent.getMinutes()
          }}
        </span>
      </div>
      <div class="message">{{ message.message }}</div>
    </div>
  </div>
</template>

<style scoped>
.submit-button {
  border: none;
  background-color: transparent;
  border: 1px solid black;
  margin-left: 1vw;
  padding: 0 4px;
  font-size: 1.5rem;
  border-radius: 20px;
  cursor: pointer;
}
.message-input-container {
  position: absolute;
  bottom: 0;
  left: 30vw;
  margin: 0 auto;
}
.message-input-container * {
  padding: 4px;
}
.message-input {
  width: 40vw;
  height: 2rem;
  border-radius: 5px;
  border: 1px solid #cccccc6b;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.messages-container {
  width: 60%;
  margin: 0 auto;
  margin-top: 2vh;
}
.message-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: rgb(167, 178, 189);
}
.sender-time {
  font-size: 1rem;
  color: #888;
}
.message {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>
