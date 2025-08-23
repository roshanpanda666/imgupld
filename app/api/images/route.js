import { connectionSRT } from "@/app/lib/data";
import { imgmodel } from "@/app/lib/model/uploadschema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET all images
export async function GET() {
    try {
      await mongoose.connect(connectionSRT);
      const images = await imgmodel.find({}).sort({ uploadedAt: -1 });
      return NextResponse.json(images);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ success: false, error: err.message });
    }
  }

  // POST a new image
export async function POST(req) {
    try {
      await mongoose.connect(connectionSRT);
      const body = await req.json(); // expecting { img1, fileName, fileType, fileSize }
  
      const newImage = new imgmodel({
        img1: body.img1,
        fileName: body.fileName,
        fileType: body.fileType,
        fileSize: body.fileSize,
      });

      const savedImage = await newImage.save();
    return NextResponse.json({ success: true, data: savedImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}