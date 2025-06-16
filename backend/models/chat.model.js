import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          required: true,
          enum: ["user", "model"],
        },
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
            image: {
              url: { type: String, default: "" },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
