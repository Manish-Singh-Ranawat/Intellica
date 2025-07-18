import { getAuth } from "@clerk/express";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import { generateAIResponse } from "../lib/gemini.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../lib/cloudinary.js";

export const createNewChat = async (req, res) => {
  try {
    // get text and image
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { text, image } = req.body;
    if (!text.trim())
      return res.status(400).json({ message: "Missing input text" });
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }
    // generate ai response and save chat
    const aiResponse = await generateAIResponse(text, imageUrl);
    const userData = {
      role: "user",
      parts: [{ text, image: { url: imageUrl } }],
    };
    const aiData = { role: "model", parts: [{ text: aiResponse }] };
    const newChat = new Chat({
      userId: userId,
      history: [userData, aiData],
    });
    const savedChat = await newChat.save();
    //  update user
    const user = await User.findOne({ userId: userId });
    if (!user) {
      const newUser = new User({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 30),
          },
        ],
      });
      await newUser.save();
    } else {
      await User.updateOne(
        { userId: userId },
        {
          $push: {
            chats: { _id: savedChat._id, title: text.substring(0, 30) },
          },
        }
      );
    }
    return res.status(200).json({ id: savedChat._id, aiResponse: aiResponse });
  } catch (error) {
    console.log("error in create new chat controller : ", error);
    return res.status(500).json({ message: "Failed to create new chat" });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findOne({ userId: userId });
    return res.status(200).json({ chats: user?.chats });
  } catch (error) {
    console.log("error in get all chats controller : ", error);
    return res.status(500).json({ message: "Failed to get all chats" });
  }
};

export const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const chat = await Chat.findOne({ _id: id, userId: userId });
    return res.status(200).json({ chat });
  } catch (error) {
    console.log("error in get chat controller : ", error);
    return res.status(500).json({ message: "Failed to get chat" });
  }
};

export const resumeChat = async (req, res) => {
  try {
    // get text and image
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { text, image } = req.body;
    if (!text.trim())
      return res.status(400).json({ message: "Missing input text" });
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }
    // generate ai response and update chat
    const chat = await Chat.findOne({ _id: id, userId: userId });
    const aiResponse = await generateAIResponse(text, imageUrl, chat.history);
    const userData = {
      role: "user",
      parts: [{ text, image: { url: imageUrl } }],
    };
    const aiData = { role: "model", parts: [{ text: aiResponse }] };
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        $push: { history: { $each: [userData, aiData] } },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ id: updatedChat._id, aiResponse: aiResponse });
  } catch (error) {
    console.log("error in resume chat controller : ", error);
    return res.status(500).json({ message: "Failed to resume chat" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const deletedChat = await Chat.findOneAndDelete({
      _id: id,
      userId: userId,
    });
    // Delete images from Cloudinary
    for (const message of deletedChat.history) {
      for (const part of message.parts) {
        if (part.image?.url) {
          await deleteImageFromCloudinary(part.image.url);
        }
      }
    }
    await User.updateOne({ userId: userId }, { $pull: { chats: { _id: id } } });
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.log("error in delete chat controller : ", error);
    return res.status(500).json({ message: "Failed to delete chat" });
  }
};
