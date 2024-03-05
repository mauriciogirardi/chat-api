"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_socket = require("socket.io");

// src/app.ts
var import_express = __toESM(require("express"));
var app = (0, import_express.default)();

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/server.ts
var server = app.listen(env.PORT, () => {
  console.info(`Server is running port ${env.PORT}!`);
});
var io = new import_socket.Server(server, {
  cors: {
    origin: "*"
  }
});
var onlineUsers = [];
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
      }
    }
    onlineUsers.forEach((user) => {
      io.to(user).emit("online-users-updated", onlineUsers);
    });
  });
  socket.on("send-new-message", (message) => {
    message.chat.users.forEach((user) => {
      io.to(user._id).emit("new-message-received", message);
    });
  });
  socket.on(
    "add-user-chat",
    ({
      chats,
      userId,
      type
    }) => {
      if (type === "chat") {
        io.to(userId).emit("add-new-user-chat", chats);
      } else {
        chats.forEach((chat) => {
          chat.users.forEach((user) => {
            io.to(user._id).emit("add-new-user-chat", chats);
          });
        });
      }
    }
  );
  socket.on(
    "read-all-messages",
    ({
      chatId,
      users,
      readByUserId
    }) => {
      users?.forEach((user) => {
        io.to(user).emit("user-read-all-chat-messages", {
          chatId,
          readByUserId
        });
      });
    }
  );
  socket.on(
    "typing",
    ({
      chat,
      senderId,
      senderName
    }) => {
      chat.users.forEach((user) => {
        if (user._id !== senderId) {
          io.to(user._id).emit("typing", { chat, senderName });
        }
      });
    }
  );
  socket.on("logout", (userId) => {
    socket.leave(userId);
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    onlineUsers.forEach((user) => {
      io.to(user).emit("online-users-updated", onlineUsers);
    });
  });
});
