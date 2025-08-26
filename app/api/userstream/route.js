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

        const onChange = (change) => {
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
            }
          } catch (err) {
            console.warn("⚠️ Stream closed, skipping enqueue");
          }
        };

        changeStream.on("change", onChange);

        // 👇 Handle when client disconnects
        controller.onclose = () => {
          console.log("❌ Client disconnected, closing change stream...");
          changeStream.close();
        };
        controller.onabort = () => {
          console.log("❌ Stream aborted, closing change stream...");
          changeStream.close();
        };
      },
      cancel() {
        console.log("❌ Stream canceled, cleaning up...");
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
