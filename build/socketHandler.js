"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/socketHandler.ts
var socketHandler_exports = {};
__export(socketHandler_exports, {
  socketHandler: () => socketHandler
});
module.exports = __toCommonJS(socketHandler_exports);
var import_socket = require("socket.io");
function socketHandler(server) {
  const io = new import_socket.Server(server, {
    cors: {
      origin: "*"
    }
  });
  let onlineUsers = [];
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  socketHandler
});
