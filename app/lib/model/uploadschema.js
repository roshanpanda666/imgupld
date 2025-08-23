import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    img1: { type: String, required: true }, // Base64 string
    fileName: { type: String },             // optional: image name
    fileType: { type: String },             // optional: image type (jpeg/png)
    fileSize: { type: Number },             // optional: size in bytes
    uploadedAt: { type: Date, default: Date.now },
  });

export const imgmodel= mongoose.models.Image || mongoose.model("Image", ImageSchema, "imgcollection");
