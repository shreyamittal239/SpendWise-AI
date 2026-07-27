const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware");


const {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileStats
} = require("../controller/authcontroller");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post(
    "/reset-password/:resetToken",
    resetPassword
);
router.get("/profile" , authMiddleware , getProfile )
router.put("/profile" , authMiddleware, updateProfile)
router.put(
    "/upload-profile",
    authMiddleware,
    upload.single("profileImage"),
    uploadProfileImage
);
router.get("/profile-stats", authMiddleware, getProfileStats);
module.exports = router;