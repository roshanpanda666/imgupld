import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  password: String,
  user1: String,
});

// 👇 Here we map to a DIFFERENT collection
export const usermodel= mongoose.models.User || mongoose.model("User", UserSchema, "usercollection");
