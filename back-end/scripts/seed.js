import mongoose, { Post, User } from "../model/index.js";

import data from "./seed_data.json" assert {type: "json"};

await mongoose.connection.dropDatabase();

const authors 