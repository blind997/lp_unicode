import dotenv from "dotenv"
import connectDB from "./config/datab.js"
import authRoute from "./routes/authRoute.js";
import express from "express"
dotenv.config();
await connectDB();
const app =express()
app.use(express.json());

app.use("/api/auth",authRoute);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

