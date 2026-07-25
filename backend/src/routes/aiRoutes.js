const express = require("express");
const authMiddleware = require("../middleware/authMiddleware")
const {chatWithAI , analyzeExpenseController , streamChatWithAI} = require("../controller/aiContoller")

const router = express.Router();

router.post("/chat", authMiddleware, chatWithAI);
router.post(
    "/chat/stream",
    authMiddleware,
    streamChatWithAI
);
router.post(
    "/analyze",
    authMiddleware,
    analyzeExpenseController
);


module.exports = router;