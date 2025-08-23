import { connectionSRT } from "@/app/lib/data";
import { imgmodel } from "@/app/lib/model/uploadschema";

import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    await mongoose.connect(connectionSRT)
    const data=await imgmodel.find({})
    console.log(data);
    return NextResponse.json(data)
}
