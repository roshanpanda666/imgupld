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
    // console.log("Payload:", payload); // check if badword is here
    const result= await user.save()
    return NextResponse.json({success:true,result})
    
}

// ✅ DELETE API
export async function DELETE(request) {
    try {
      const { id } = await request.json(); // expecting { "id": "user_id_here" }
  
      if (!id) {
        return NextResponse.json({ success: false, error: "Missing user id" }, { status: 400 });
      }
  
      await mongoose.connect(connectionSRT);
  
      const deletedUser = await usermodel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: "User deleted", deletedUser });
    } catch (err) {
      console.error("❌ Delete API Error:", err);
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  }