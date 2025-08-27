import { connectionSRT } from "@/app/lib/data";
import mongoose from "mongoose";
import { usermodel } from "@/app/lib/model/userschema";

export async function GET() {
  await mongoose.connect(connectionSRT);
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        // open change stream
        const changeStream = usermodel.watch();

        // listen for changes
        changeStream.on("change", (change) => {
          console.log("🔥 Change detected:", change);

          try {
            if (change.operationType === "insert") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "insert",
                    doc: change.fullDocument,
                  })}\n\n`
                )
              );
            } else if (change.operationType === "update") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "update",
                    docId: change.documentKey._id,
                    updatedFields: change.updateDescription.updatedFields,
                    removedFields: change.updateDescription.removedFields,
                  })}\n\n`
                )
              );
            } else if (change.operationType === "delete") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "delete",
                    docId: change.documentKey._id,
                  })}\n\n`
                )
              );
            }
          } catch (err) {
            console.warn("⚠️ Failed enqueue, probably client disconnected");
          }
        });

        // keep-alive heartbeat to stop idle disconnects
        const keepAlive = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(":\n\n")); // SSE comment = heartbeat
          } catch {
            clearInterval(keepAlive);
            changeStream.close();
          }
        }, 15000); // 15s ping
      },

      cancel() {
        console.log("❌ Stream canceled, cleaning up...");
        changeStream?.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    }
  );
}
