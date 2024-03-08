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

// src/models/messageModel.ts
var messageModel_exports = {};
__export(messageModel_exports, {
  default: () => messageModel_default
});
module.exports = __toCommonJS(messageModel_exports);
var import_mongoose = require("mongoose");
var messageSchema = new import_mongoose.Schema(
  {
    socketMessageId: {
      type: String,
      default: ""
    },
    chat: {
      type: import_mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true
    },
    sender: {
      type: import_mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    readBy: {
      type: [import_mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: []
    }
  },
  { timestamps: true }
);
if (import_mongoose.models && import_mongoose.models.messages) {
  (0, import_mongoose.deleteModel)("messages");
}
var MessageModel = (0, import_mongoose.model)("messages", messageSchema);
var messageModel_default = MessageModel;
