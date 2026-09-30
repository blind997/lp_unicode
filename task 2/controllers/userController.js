import User from "../models/User.js"
import bcrypt from "bcryptjs"
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

export default register