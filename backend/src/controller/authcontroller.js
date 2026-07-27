const bcrypt = require("bcrypt");
const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const crypto = require("crypto");
const sendEmail = require("../services/sendEmail")
const emailTemplate = require("../services/emailTemplates");
const Expense = require("../models/expense");
const Group = require("../models/group");


const register = async (req, res) => {
   const {name , email, password } = req.body; 

   if(!name || !email || !password ) {
    return res.status(400).json({
        success:false,
        message: "All fields are required"
    })
   }

   const existingUser = await User.findOne({email});

   if ( existingUser) {
    return res.status(409).json({
        success:false,
        message:"user already registered"
    })
   }

   const hashedPassword = await bcrypt.hash(password , 10);

    const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
};

const login = async (req, res) => {

    const {email , password } = req.body;
   

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })

    }
  const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:'user not found',
            
            })
        }

  const isMatch = await bcrypt.compare(password , user.password)
  
  
  if(!isMatch){
    return res.status(401).json({
        success:false,
        message:"Invalid credentials",
    })
  }

  const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
             secure: true,
              sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
                 user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
    },
        });

};

const logout = async (req, res) => {
      res.clearCookie("token");

    res.status(200).json({
        success: true,
         secure: true,
        sameSite: "none",
        message: "Logged out successfully"
    });
};

const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

   const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("Email received:", email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        console.log("User Found:", user.email);

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        console.log("Token saved");

        const resetUrl = `expense-tracker-mern-zeta-eight.vercel.app/reset-password/${resetToken}`;

        const html = emailTemplate(
    user.name,
    resetUrl
);

await sendEmail({

    to: user.email,

    subject: "Reset Your SpendWise AI Password",

    html,

});

        console.log("Email Sent");

        res.status(200).json({
            success: true,
            message: "Password reset link sent",
        });

    } catch (error) {
        console.error("Forgot Password Error:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const resetPassword =  async(req,res) => {
     const {resetToken} = req.params;

     const hashedToken = crypto
   .createHash("sha256")
   .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: {
        $gt: Date.now()
    }
});

  if (!user) {
    return res.status(400).json({
        success:false,
        message:"Invalid or expired token"
    });
}
   const {
    password,
    confirmPassword
} = req.body;

   if(password !== confirmPassword){
    return res.status(400).json({
        success:false,
        message:"Passwords do not match"
    });
}

user.password =
await bcrypt.hash(password, 10);

user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success:true,
    message:"Password reset successfully"
});
}

const getProfile = async ( req, res) => {
    try{
        const user = await User.findById(req.user.id)
        .select("-password");

        res.status(200).json({
            succes:true,
            user,
        })
    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

const updateProfile = async ( req , res ) => {
    try{
        const {name , email} = req.body;
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        user.name = name || user.name;
        user.email = email || user.email;

        

        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            user,
        })
    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        console.log("1. Request received");

        console.log("2. File:", req.file);

        console.log("3. User:", req.user);

        const user = await User.findById(req.user.id);

        console.log("4. User found");

        user.profileImage = req.file.path;

        console.log("5. Image URL:", req.file.path);

        await user.save();

        console.log("6. User saved");

        res.status(200).json({
            success: true,
            message: "Profile updated",
            profileImage: user.profileImage,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProfileStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [
            totalExpenses,
            totalGroups,
            totalSpentResult
        ] = await Promise.all([

            Expense.countDocuments({ user: userId }),

            Group.countDocuments({
                members: userId,
            }),

            Expense.aggregate([
                {
                    $match: {
                        user: req.user._id,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
        ]);

        res.json({
            totalExpenses,
            totalGroups,
            totalSpent: totalSpentResult[0]?.total || 0,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to fetch profile statistics",
        });
    }
};
module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileStats,
};