const authRouter = require("../module/auth/auth.router");
const chatRouter = require("../module/chat/chat.router");

const router = require("express").Router();

router.get("", (req ,res)=> {
  res.end("hello world!!");
});

router.use("/auth",authRouter);
router.use("/chat",chatRouter);

module.exports = router;
