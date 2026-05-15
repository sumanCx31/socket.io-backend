const messageModel = require("./message.model");

const chatRouter = require("express").Router();

chatRouter.get("/", async (req, res) => {
  try {
    const messages = await messageModel.find().sort({ createdAt: 1 });

    res.json({
      data: messages,
      message: "Chat history fetched",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching messages",
    });
  }
});

module.exports = chatRouter;