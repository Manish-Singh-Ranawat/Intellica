import express from "express";
import path from "path";
import cors from "cors";
import { ENV_VARS } from "./lib/envVars.js";
import { connectDB } from "./lib/mongodb.js";
import chatRoutes from "./routes/chat.route.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

if (ENV_VARS.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ENV_VARS.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(express.json());

app.use(clerkMiddleware());
app.use("/api/v1/chats", chatRoutes);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

app.listen(PORT, () => {
  console.log("Server started");
  connectDB();
});
