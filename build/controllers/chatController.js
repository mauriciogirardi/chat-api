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

// src/controllers/chatController.ts
var chatController_exports = {};
__export(chatController_exports, {
  createNewChatController: () => createNewChatController,
  getAllChatsController: () => getAllChatsController,
  getChatDataByIdController: () => getChatDataByIdController,
  updateChatController: () => updateChatController
});
module.exports = __toCommonJS(chatController_exports);
var import_zod = __toESM(require("zod"));

// src/models/chatModel.ts
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

// src/controllers/chatController.ts
var createNewChatController = async (req, res) => {
  try {
    const schemaBort = import_zod.default.object({
      users: import_zod.default.string().array(),
      createdBy: import_zod.default.string(),
      isGroupChat: import_zod.default.boolean().optional(),
      groupName: import_zod.default.string().optional(),
      groupProfilePicture: import_zod.default.string().optional(),
      groupBio: import_zod.default.string().optional(),
      groupAdmins: import_zod.default.string().array().optional(),
      unreadCounts: import_zod.default.object({}).optional()
    });
    const data = schemaBort.parse(req.body);
    await ChatModel.create(data);
    const chats = await ChatModel.find({
      users: {
        $in: [data.createdBy]
      }
    }).populate("users").sort({ updatedAt: -1 });
    return res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
  }
};
var getAllChatsController = async (req, res) => {
  try {
    const schemaParams = import_zod.default.object({
      userId: import_zod.default.string()
    });
    const { userId } = schemaParams.parse(req.params);
    const chats = await ChatModel.find({
      users: {
        $in: [userId]
      }
    }).populate("users").populate("lastMessage").populate("createdBy").populate({ path: "lastMessage", populate: { path: "sender" } }).sort({ lastMessageAt: -1 });
    return res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
  }
};
var getChatDataByIdController = async (req, res) => {
  try {
    const schemaParams = import_zod.default.object({
      chatId: import_zod.default.string()
    });
    const { chatId } = schemaParams.parse(req.params);
    const chat = await ChatModel.findById(chatId).populate("users").populate("lastMessage").populate("createdBy").populate({ path: "lastMessage", populate: { path: "sender" } }).sort({ updatedAt: -1 });
    return res.status(200).json({ chat });
  } catch (error) {
    console.error(error);
  }
};
var updateChatController = async (req, res) => {
  try {
    const schemaParams = import_zod.default.object({
      chatId: import_zod.default.string()
    });
    const schemaBody = import_zod.default.object({
      users: import_zod.default.array(import_zod.default.string()),
      createdBy: import_zod.default.string(),
      isGroupChat: import_zod.default.boolean().optional(),
      lastMessage: import_zod.default.object({}).optional(),
      groupName: import_zod.default.string().optional(),
      groupProfilePicture: import_zod.default.string().optional(),
      groupBio: import_zod.default.string().optional(),
      groupAdmins: import_zod.default.array(import_zod.default.string()).optional(),
      unreadCounts: import_zod.default.object({}).optional()
    });
    const { chatId } = schemaParams.parse(req.params);
    const chat = schemaBody.parse(req.body);
    const chatUpdated = await ChatModel.findByIdAndUpdate(chatId, chat);
    return res.status(200).json({ chat: chatUpdated });
  } catch (error) {
    console.error(error);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNewChatController,
  getAllChatsController,
  getChatDataByIdController,
  updateChatController
});
