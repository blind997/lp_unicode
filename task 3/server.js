import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/datab.js";
import authRoute from "./routes/authroute.js";
import auctionRoute from "./routes/auctionRoutes.js";
import morgan from "morgan";
import logger from "./utils/logger.js"
dotenv.config();
const app =express()
await connectDB();
app.use(express.json());
app.use(morgan("dev"));//its a request logger, CCTV log for APi
app.use("/auth", authRoute);
app.use("/auctions", auctionRoute);
app.listen(4000, () => {
    logger.info("Server running on port 4000");
});