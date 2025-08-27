import { connectionSRT } from "@/app/lib/data";
import { usermodel } from "@/app/lib/model/userschema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import fs from "fs";
import natural from "natural";

let isWatching = false; // prevent multiple listeners in dev

// 🔥 Setup NLP filter
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const badwords = [
    // General profanity
    "fuck", "fucker", "shit", "bullshit", "asshole", "bitch", "bastard", 
    "dick", "cock", "pussy", "cunt", "slut", "whore", "twat", "prick", 
    "motherfucker", "son of a bitch", "damn", "hell",
  
    // NSFW / sexual
    "porn", "nsfw", "xxx", "sex", "nude", "naked", "blowjob", "handjob", 
    "dildo", "vibrator", "anal", "oral", "cum", "semen", "orgasm", 
    "ejaculation", "boobs", "tits", "milf", "fetish", "bdsm", "kink", 
    "erotic", "hardcore", "stripper",
  
    // Racist / hate speech
    "nigger", "nigga", "chink", "spic", "fag", "faggot", "tranny", 
    "retard", "cripple", "gook", "coon", "paki", "raghead", "jap", 
    "wetback", "kike", "dyke",
  
    // Self-harm / violence
    "kill yourself", "suicide", "die", "murder", "terrorist", "bomb", 
    "shoot", "school shooter", "stab", "rape", "rapist",
  
    // Drugs / illegal
    "weed", "cocaine", "meth", "heroin", "lsd", "ecstasy", "crack", 
    "drug dealer", "overdose",

    //local gali
    "madharchood","bsdk","magiha","lund"
  ];
function containsNSFW(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const stemmed = tokens.map((word) => stemmer.stem(word));
  return stemmed.some((w) => badwords.includes(w));
}

export async function GET() {
  try {
    await mongoose.connect(connectionSRT);

    // 👀 Start watching once
    if (!isWatching) {
      isWatching = true;

      const changeStream = usermodel.watch();

      changeStream.on("change", async (change) => {
        if (change.operationType === "insert") {
          const newDoc = change.fullDocument;

          // ✅ Run NLP filter
          const isBad = containsNSFW(newDoc.content);

          console.log("📥 New document inserted:", newDoc);
          console.log("🚨 NSFW Detected:", isBad);

          // ✅ Save into logs.txt
          const log = `user:${newDoc.user}\ncontent:${newDoc.content}\nnsfw:${isBad}\n---\n`;
          fs.appendFile("logs.txt", log, (err) => {
            if (err) console.error("❌ Error writing log file:", err);
            else console.log("✅ Log saved to logs.txt");
          });

          // ✅ Update DB with badword flag
          if (isBad) {
            try {
              await usermodel.findByIdAndUpdate(newDoc._id, { badword: true });
              console.log(`✅ Updated doc ${newDoc._id} with badword:true`);
            } catch (err) {
              console.error("❌ Failed to update badword field:", err);
            }
          }
        }
      });

      console.log("👀 Change stream listener started...");
    }

    // Return all docs normally
    const data = await usermodel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in GET:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
