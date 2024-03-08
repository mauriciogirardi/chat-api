"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/userRouters.ts
var userRouters_exports = {};
__export(userRouters_exports, {
  routerUser: () => routerUser
});
module.exports = __toCommonJS(userRouters_exports);
var import_express = __toESM(require("express"));

// src/controllers/userController.ts
var import_zod = __toESM(require("zod"));

// src/models/userModel.ts
var import_mongoose = require("mongoose");
var userSchema = new import_mongoose.Schema(
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
if (import_mongoose.models && import_mongoose.models.users) {
  (0, import_mongoose.deleteModel)("users");
}
var UserModel = (0, import_mongoose.model)("users", userSchema);

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
    const schemaBody = import_zod.default.object({
      clerkUserId: import_zod.default.string(),
      name: import_zod.default.string(),
      username: import_zod.default.string(),
      email: import_zod.default.string(),
      profilePicture: import_zod.default.string()
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
    const schemaBody = import_zod.default.object({
      profilePicture: import_zod.default.string()
    });
    const schemaParams = import_zod.default.object({
      userId: import_zod.default.string()
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
var routerUser = import_express.default.Router();
routerUser.get("/", getAllUsersController);
routerUser.post("/", postCurrentUserFromMongoDB);
routerUser.patch("/:userId", uploadUserProfile);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routerUser
});
