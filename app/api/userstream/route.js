import { connectionSRT } from "@/app/lib/data";
import mongoose from "mongoose";
import { usermodel } from "@/app/lib/model/userschema";

export async function GET() {
  await mongoose.connect(connectionSRT);

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        const changeStream = usermodel.watch();

        changeStream.on("change", (change) => {
          console.log("🔥 Change detected:", change);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(change)}\n\n`)
          );
        });
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
