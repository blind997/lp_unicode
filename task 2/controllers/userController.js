import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const register = async (req, res) => {
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
    res.json({
        message:"user created succesfully",
        user:{
            id:user.id,
            name: user.name,
            email:user.email
        }
    });
};
const login=async(req,res)=>{
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
};
const profile = async (req, res) => {
    res.json({
        message: "authenticated",
        userId: req.userId
    });
};
export {login, register, profile}