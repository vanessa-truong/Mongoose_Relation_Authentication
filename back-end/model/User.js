import mongoose from "mongoose";
import { Post } from "./Post.js";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  posts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Post" }],
});

export const User = mongoose.model("User", userSchema);
