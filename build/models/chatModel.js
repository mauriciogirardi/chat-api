"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/models/messageModel.ts
var messageModel_exports = {};
__export(messageModel_exports, {
  default: () => messageModel_default
});
var import_mongoose, messageSchema, MessageModel, messageModel_default;
var init_messageModel = __esm({
  "src/models/messageModel.ts"() {
    "use strict";
    import_mongoose = require("mongoose");
    messageSchema = new import_mongoose.Schema(
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
    MessageModel = (0, import_mongoose.model)("messages", messageSchema);
    messageModel_default = MessageModel;
  }
});

// src/models/chatModel.ts
var chatModel_exports = {};
__export(chatModel_exports, {
  ChatModel: () => ChatModel
});
module.exports = __toCommonJS(chatModel_exports);
var import_mongoose2 = __toESM(require("mongoose"));
var chatSchema = new import_mongoose2.Schema(
  {
    users: {
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "users"
    },
    createdBy: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "users"
    },
    lastMessage: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "messages"
    },
    isGroupChat: {
      type: Boolean,
      default: false
    },
    groupName: {
      type: String,
      default: ""
    },
    groupProfilePicture: {
      type: String,
      default: ""
    },
    groupBio: {
      type: String,
      default: ""
    },
    groupAdmins: {
      type: [import_mongoose2.Schema.Types.ObjectId],
      ref: "users"
    },
    unreadCounts: {
      type: Object,
      default: {}
    },
    lastMessageAt: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);
if (import_mongoose2.models && import_mongoose2.models.chats) {
  (0, import_mongoose2.deleteModel)("chats");
}
if (!import_mongoose2.default.models.messages) {
  init_messageModel();
}
var ChatModel = (0, import_mongoose2.model)("chats", chatSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatModel
});
