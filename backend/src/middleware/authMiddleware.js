const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

    try {

        console.log("Cookies received:", req.cookies);

        const token = req.cookies.token;

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        console.log("Decoded JWT:", decoded);


        req.user = decoded;

        next();


    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        });
    }
};


module.exports = authMiddleware;