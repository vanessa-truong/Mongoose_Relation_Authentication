import mongoose from "mongoose";
import { User } from "./User.js";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
});

export const Post = mongoose.model("Post", postSchema);
