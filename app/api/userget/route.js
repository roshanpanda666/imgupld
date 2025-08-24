import { connectionSRT } from "@/app/lib/data";
import { usermodel } from "@/app/lib/model/userschema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
     await mongoose.connect(connectionSRT)
     const data=await usermodel.find({})
     console.log(data);
     return NextResponse.json(data)
}



