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

export async function POST(request){
    const payload=await request.json()
    await mongoose.connect(connectionSRT)
    let user= new usermodel(payload)
    const result= await user.save()
    return NextResponse.json({success:true,result})
    
}


