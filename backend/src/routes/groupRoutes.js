const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createGroup,
    getGroups,
    getGroup,
    addMember,
    deleteGroup,updateGroup
} = require("../controller/groupController");

router.post("/", authMiddleware, createGroup);

router.get("/", authMiddleware, getGroups);

router.get("/:id", authMiddleware, getGroup);
router.post(
    "/:id/add-member",
    authMiddleware,
    addMember
);

router.put(
    "/:id",
    authMiddleware,
    updateGroup
);

router.delete(
    "/:id",
    authMiddleware,
    deleteGroup
);

module.exports = router;