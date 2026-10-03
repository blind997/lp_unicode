import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendEmail from "../config/mail.js"
const register = async (req, res) => {
    try{
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
 const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }
    const hashedPassword= await bcrypt.hash(password,10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
   try {
    await sendEmail(
        user.email,
        "Welcome, Account Registered",
        `${user.name} registered`
    );
    } 
    catch (error) {
    console.log("Welcome email failed:", error.message);
    }
    res.json({
        message:"user created succesfully",
        user:{
            id:user.id,
            name: user.name,
            email:user.email
        }
    });
}
    catch (error){
        return res.json({
            message:"somethign went wrong"
        })
    }
};
const login=async(req,res)=>{
    try{
    const {email, password}=req.body;
    if(!email||!password){
        return res.json({
            message:"Email and password requiered"
        })
    }
    const user=await User.findOne({
        email:email
    })
    if(!user){
        return res.json({
            message:"Invalid Creds"
        })
    }
    const passwordMatch=await bcrypt.compare(password,user.password)
    if(!passwordMatch){
        return res.json({
            message:"wrong password"
        })
    }
    try {
    await sendEmail(
        user.email,
        "Login Successful",
        `${user.name} logged in`
    );
    }
     catch (error) {
    console.log("Login email failed:", error.message);
    }
    const accessToken=jwt.sign(
    { userId:user.id},
    process.env.JWT_ACCESS_SECRET,
    { expiresIn:"15m"}
)

    const refreshToken=jwt.sign(
        { userId: user.id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"5d"}
    );

    res.json({
    message:"login succesful",
    accessToken,
    refreshToken
})
    }
    catch(error){
        return res.json({
            message:"Something went wrong"
        })
    }
};
const refresh =(req,res) =>{
    const {refreshToken}=req.body;
    if (!refreshToken) {
    return res.json({
        message: "Refresh token required"
    })
    }
    try {
        const decode=jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const newAccessToken = jwt.sign(
        { userId: decode.userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
    return res.json({
        message:"new access token",
        accessToken:newAccessToken
    })    
    }
    catch(error){
             return res.json({
            message: "Invalid or expired refresh token"
        });
    }
}

const profile = async (req, res) => {
    res.json({
        message: "authenticated",
        userId: req.userId
    });
};
export {login, register, profile, refresh}