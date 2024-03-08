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

// src/models/userModel.ts
var userModel_exports = {};
__export(userModel_exports, {
  UserModel: () => UserModel
});
module.exports = __toCommonJS(userModel_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserModel
});
