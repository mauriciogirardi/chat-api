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
var import_mongoose2, messageSchema, MessageModel, messageModel_default;
var init_messageModel = __esm({
  "src/models/messageModel.ts"() {
    "use strict";
    import_mongoose2 = require("mongoose");
    messageSchema = new import_mongoose2.Schema(
      {
        socketMessageId: {
          type: String,
          default: ""
        },
        chat: {
          type: import_mongoose2.Schema.Types.ObjectId,
          ref: "chats",
          required: true
        },
        sender: {
          type: import_mongoose2.Schema.Types.ObjectId,
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
          type: [import_mongoose2.Schema.Types.ObjectId],
          ref: "users",
          default: []
        }
      },
      { timestamps: true }
    );
    if (import_mongoose2.models && import_mongoose2.models.messages) {
      (0, import_mongoose2.deleteModel)("messages");
    }
    MessageModel = (0, import_mongoose2.model)("messages", messageSchema);
    messageModel_default = MessageModel;
  }
});

// src/server.ts
var import_cors = __toESM(require("cors"));
var import_express5 = __toESM(require("express"));

// src/app.ts
var import_express = __toESM(require("express"));
var app = (0, import_express.default)();

// src/db/index.ts
var import_mongoose = __toESM(require("mongoose"));

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333),
  MONGO_URL: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/db/index.ts
var connectMongoDB = async () => {
  try {
    await import_mongoose.default.connect(env.MONGO_URL);
    console.info("MongoDB connected!!");
  } catch (error) {
    console.error(error);
  }
};

// src/error/errorHandler.ts
var import_zod2 = require("zod");
var errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error instanceof import_zod2.z.ZodError) {
    res.status(400).send({ error: "Validations error", message: error.errors[0].message });
  } else {
    res.status(500).send({ error: "Internal server error!" });
  }
};

// src/routes/chatRouters.ts
var import_express2 = __toESM(require("express"));

// src/controllers/chatController.ts
var import_zod3 = __toESM(require("zod"));

// src/models/chatModel.ts
var import_mongoose3 = __toESM(require("mongoose"));
var chatSchema = new import_mongoose3.Schema(
  {
    users: {
      type: [import_mongoose3.Schema.Types.ObjectId],
      ref: "users"
    },
    createdBy: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "users"
    },
    lastMessage: {
      type: import_mongoose3.Schema.Types.ObjectId,
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
      type: [import_mongoose3.Schema.Types.ObjectId],
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
if (import_mongoose3.models && import_mongoose3.models.chats) {
  (0, import_mongoose3.deleteModel)("chats");
}
if (!import_mongoose3.default.models.messages) {
  init_messageModel();
}
var ChatModel = (0, import_mongoose3.model)("chats", chatSchema);

// src/controllers/chatController.ts
var createNewChatController = async (req, res) => {
  try {
    const schemaBort = import_zod3.default.object({
      users: import_zod3.default.string().array(),
      createdBy: import_zod3.default.string(),
      isGroupChat: import_zod3.default.boolean().optional(),
      groupName: import_zod3.default.string().optional(),
      groupProfilePicture: import_zod3.default.string().optional(),
      groupBio: import_zod3.default.string().optional(),
      groupAdmins: import_zod3.default.string().array().optional(),
      unreadCounts: import_zod3.default.object({}).optional()
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
    const schemaParams = import_zod3.default.object({
      userId: import_zod3.default.string()
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
    const schemaParams = import_zod3.default.object({
      chatId: import_zod3.default.string()
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
    const schemaParams = import_zod3.default.object({
      chatId: import_zod3.default.string()
    });
    const schemaBody = import_zod3.default.object({
      users: import_zod3.default.array(import_zod3.default.string()),
      createdBy: import_zod3.default.string(),
      isGroupChat: import_zod3.default.boolean().optional(),
      lastMessage: import_zod3.default.object({}).optional(),
      groupName: import_zod3.default.string().optional(),
      groupProfilePicture: import_zod3.default.string().optional(),
      groupBio: import_zod3.default.string().optional(),
      groupAdmins: import_zod3.default.array(import_zod3.default.string()).optional(),
      unreadCounts: import_zod3.default.object({}).optional()
    });
    const { chatId } = schemaParams.parse(req.params);
    const chat = schemaBody.parse(req.body);
    const chatUpdated = await ChatModel.findByIdAndUpdate(chatId, chat);
    return res.status(200).json({ chat: chatUpdated });
  } catch (error) {
    console.error(error);
  }
};

// src/routes/chatRouters.ts
var routerChat = import_express2.default.Router();
routerChat.get("/:chatId", getChatDataByIdController);
routerChat.get("/user/:userId", getAllChatsController);
routerChat.post("/", createNewChatController);
routerChat.put("/:chatId", updateChatController);

// src/routes/messageRouters.ts
var import_express3 = __toESM(require("express"));

// src/controllers/messageController.ts
var import_zod4 = __toESM(require("zod"));
init_messageModel();
var sendNewMessageController = async (req, res) => {
  try {
    const schemaBort = import_zod4.default.object({
      text: import_zod4.default.string().optional(),
      image: import_zod4.default.string().optional(),
      chat: import_zod4.default.string(),
      sender: import_zod4.default.string(),
      readBy: import_zod4.default.array(import_zod4.default.string()).optional(),
      socketMessageId: import_zod4.default.string(),
      createdAt: import_zod4.default.string(),
      updatedAt: import_zod4.default.string()
    });
    const data = schemaBort.parse(req.body);
    const newMessage = new messageModel_default(data);
    await newMessage.save();
    const existingChat = await ChatModel.findById(data.chat);
    const existingUnreadCounts = existingChat?.unreadCounts;
    existingChat?.users.forEach((userId) => {
      const userIdInString = userId.toString();
      if (userIdInString !== data.sender) {
        existingUnreadCounts[userIdInString] = (existingUnreadCounts[userIdInString] || 0) + 1;
      }
    });
    await ChatModel.findByIdAndUpdate(data.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
      lastMessageAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return res.status(201).json({});
  } catch (error) {
    console.error(error);
  }
};
var getChatMessagesController = async (req, res) => {
  try {
    const schemaParams = import_zod4.default.object({ chatId: import_zod4.default.string() });
    const { chatId } = schemaParams.parse(req.params);
    const messages = await messageModel_default.find({ chat: chatId }).populate("sender").sort({ createdAt: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
  }
};
var readAllMessagesControllers = async (req, res) => {
  try {
    const schemaParams = import_zod4.default.object({ chatId: import_zod4.default.string(), userId: import_zod4.default.string() });
    const { chatId, userId } = schemaParams.parse(req.body);
    await messageModel_default.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: {
          $nin: [userId]
        }
      },
      { $addToSet: { readBy: userId } }
    );
    const existingChat = await ChatModel.findById(chatId);
    const existingUnreadCounts = existingChat?.unreadCounts;
    const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 };
    await ChatModel.findByIdAndUpdate(chatId, {
      unreadCounts: newUnreadCounts
    });
    return res.status(201).send({});
  } catch (error) {
    console.error(error);
  }
};

// src/routes/messageRouters.ts
var routerMessage = import_express3.default.Router();
routerMessage.get("/:chatId", getChatMessagesController);
routerMessage.post("/", sendNewMessageController);
routerMessage.post("/read", readAllMessagesControllers);

// src/routes/userRouters.ts
var import_express4 = __toESM(require("express"));

// src/controllers/userController.ts
var import_zod5 = __toESM(require("zod"));

// src/models/userModel.ts
var import_mongoose4 = require("mongoose");
var userSchema = new import_mongoose4.Schema(
  {
    clerkUserId: {
      type: String,
      require: true,
      unique: true
    },
    name: {
      type: String,
      require: true
    },
    username: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String
    },
    profilePicture: {
      type: String,
      require: false
    },
    bio: {
      type: String,
      require: false
    }
  },
  { timestamps: true }
);
if (import_mongoose4.models && import_mongoose4.models.users) {
  (0, import_mongoose4.deleteModel)("users");
}
var UserModel = (0, import_mongoose4.model)("users", userSchema);

// src/controllers/userController.ts
var getAllUsersController = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res.status(404).json({ message: "Not users found!" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};
var postCurrentUserFromMongoDB = async (req, res) => {
  try {
    const schemaBody = import_zod5.default.object({
      clerkUserId: import_zod5.default.string(),
      name: import_zod5.default.string(),
      username: import_zod5.default.string(),
      email: import_zod5.default.string(),
      profilePicture: import_zod5.default.string()
    });
    const { clerkUserId, email, name, profilePicture, username } = schemaBody.parse(req.body);
    const alreadyUserExistis = await UserModel.findOne({
      clerkUserId
    });
    if (alreadyUserExistis) {
      return res.status(201).json({ user: alreadyUserExistis });
    }
    const newUserPayload = {
      clerkUserId,
      name,
      username,
      email,
      profilePicture
    };
    const user = await UserModel.create(newUserPayload);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
  }
};
var uploadUserProfile = async (req, res) => {
  try {
    const schemaBody = import_zod5.default.object({
      profilePicture: import_zod5.default.string()
    });
    const schemaParams = import_zod5.default.object({
      userId: import_zod5.default.string()
    });
    const { profilePicture } = schemaBody.parse(req.body);
    const { userId } = schemaParams.parse(req.params);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture },
      {
        new: true
      }
    );
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
  }
};

// src/routes/userRouters.ts
var routerUser = import_express4.default.Router();
routerUser.get("/", getAllUsersController);
routerUser.post("/", postCurrentUserFromMongoDB);
routerUser.patch("/:userId", uploadUserProfile);

// src/socketHandler.ts
var import_socket = require("socket.io");
function socketHandler(server2) {
  const io = new import_socket.Server(server2, {
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

// src/server.ts
connectMongoDB();
app.use(import_express5.default.json());
app.use((0, import_cors.default)());
app.use("/users", routerUser);
app.use("/chats", routerChat);
app.use("/messages", routerMessage);
app.use(errorHandler);
var server = app.listen(env.PORT, () => {
  console.info(`Server is running port ${env.PORT}!`);
});
socketHandler(server);
