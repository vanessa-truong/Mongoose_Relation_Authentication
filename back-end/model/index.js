import mongoose from "mongoose";
import dotenv from "dotenv";
export default mongoose;

export { Post } from "./Post.js";
export { User } from "./User.js";

dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });

mongoose.connect(process.env.DB);
