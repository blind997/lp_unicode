import Auction from "../models/Auction.js";
import cloudinary from "../config/cloudinary.js"
import {Readable} from "stream";//node js function that converts image buffer into a stream cloudinary can recieive
const createAuction = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            startingPrice,
            startTime,
            endTime
        } = req.body;

        if (!title ||!description ||!category ||startingPrice === undefined ||!startTime ||!endTime)
        {
            return res.status(400).json({
                message: "All auction fields are required"//checks for all fields
            });
        }

        if (!Number.isFinite(Number(startingPrice)) ||Number(startingPrice) < 1) {
            return res.status(400).json({
                message: "Starting price must be at least 1"
            });//ensures price is atleat 1
        }

        const start = new Date(startTime)
        const end = new Date(endTime)
  if (Number.isNaN(start.getTime()) ||Number.isNaN(end.getTime()) || end <= start) {
            return res.status(400).json({
                message: "Invalid auction timings"
            });
        }//checks for valid auction times
        const image = [];//create array to store object containg url and public_id

    if (req.files && req.files.length > 0) //check if any images uploaded
        {
        for (const file of req.files) {
        const imageData = await uploadToCloudinary(file.buffer);
        image.push(imageData);
        }
        }
        const auction = await Auction.create({
            title,
            description,
            category,
            startingPrice: Number(startingPrice),
            startTime: start,
            endTime: end,
            seller: req.userId,
            images:image
        });

        return res.status(201).json({
            message: "Auction created successfully",
            auction
        });

    } catch (error) {
        console.error("Create auction error:", error);

        return res.status(500).json({
            message: "Failed"
        });
    }
};
 const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .populate("seller", "name email");// gives all valid auctions and stores them in auctions variable
        
        const updatedAuctions = await Promise.all(
            auctions.map(async (auction) => {
                const currentStatus = calculateAuctionStatus(auction);

                if (auction.status !== currentStatus) {
                    auction.status = currentStatus;
                    await auction.save();
                }//goes through each auction and calculates current status and changes database value

                return auction;
            })
        );
        return res.status(200).json({
            count: updatedAuctions.length,
            auctions:updatedAuctions
        });
    } catch (error) {
        console.error("auctions error:", error);

        return res.status(500).json({
            message: "Failed "
        });
    }
};
const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id).populate("seller", "name email");//store requested auction in variable

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }
        
const currentStatus = calculateAuctionStatus(auction);

if (auction.status !== currentStatus) {
    auction.status = currentStatus;
    await auction.save();
}// changes databse status value



return res.status(200).json({ auction });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid auction ID"
            });
        }

        console.error("Get auction error:", error);

        return res.status(500).json({
            message: "Failed to fetch auction"
        });
    }
};

const calculateAuctionStatus = (auction) => {
    const now = new Date();// gets current date and time

    if (now < auction.startTime){//tells when auction started {
        return "UPCOMING";
    }

    if (now >= auction.endTime){//gives end time {
        return "ENDED";
    }

    return "ACTIVE";
};
const updateAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }
        if (
            auction.seller.toString() !== req.userId &&
            req.userRole !== "Admin"
        ) {
            return res.status(403).json({
                message: "You can only update your own auctions"
            });
        }//checks ownership and role

        const {
            title,
            description,
            category,
            startingPrice,
            startTime,
            endTime
        } = req.body;

        if (title !== undefined) auction.title = title;
        if (description !== undefined) auction.description = description;
        if (category !== undefined) auction.category = category;

        if (startingPrice !== undefined) {
            if (
                !Number.isFinite(Number(startingPrice)) ||
                Number(startingPrice) < 1
            ) {
                return res.status(400).json({
                    message: "Starting price must be at least 1"
                });
            }

            auction.startingPrice = Number(startingPrice);
        }

        if (startTime !== undefined) {
            const start = new Date(startTime);

            if (Number.isNaN(start.getTime())) {
                return res.status(400).json({
                    message: "Invalid start time"
                });
            }

            auction.startTime = start;
        }

        if (endTime !== undefined) {
            const end = new Date(endTime);

            if (Number.isNaN(end.getTime())) {
                return res.status(400).json({
                    message: "Invalid end time"
                });
            }

            auction.endTime = end;
        }

        if (auction.endTime <= auction.startTime) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        auction.status = calculateAuctionStatus(auction);

        await auction.save();

        return res.status(200).json({
            message: "Auction updated ",
            auction
        });

    }  catch (error) {
    console.error("Update auction error:", error);

    return res.status(500).json({
        message: "Failed to update auction"
    });


    }        
};

 const deleteAuction=async(req,res)=>{
    try{
        const auction=await Auction.findById(req.params.id);
        if(!auction){
            return res.status(404).json({
                message:"Auction not found"
            })
        }
        if(auction.seller.toString()!= req.userId && req.userRole!="Admin")
        {
            return res.status(403).json({
                message:"no access to delete"
            })
        }
       for (const image of auction.images) {
        const result = await cloudinary.uploader.destroy(image.public_id);//deletes images form cloudinary
        }
        await auction.deleteOne()

        return res.json({
            message:"delete succesfully"
        });

    }catch(error){
        console.error("Delete auction error",error)
        return res.status(500).json({
            message:error.message
        })
    }
};
const uploadToCloudinary =(buffer)=>{//buffer is the image data we want to upload
    return new Promise((resolve, reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream(// ask cloudinary to uplad the image
        {
            folder:"auction_images",
            resource_type:"image"
        },
        (error, result)=>{
            if(error){
                return reject(error);
            }
            resolve({//if it succeds, cloudinary gives image url
                url:result.secure_url,//actual link to the image
                public_id: result.public_id//images unique identifier, we need this to identify imagedd on cloudinary so we can delete
            });
            

        }


        )
        Readable.from(buffer).pipe(uploadStream);//connects the imagae to cloudinary
        //readable.from(buffer)=takes the buffer containing the img data and creates a readable steam form it 
        //.pipe()sends the streams ddata unto cloudinaryt uplaod stream
        //stream-transfers data peice be peice
        //buffer-holds the entire data in memory
        })
}
export {deleteAuction, createAuction, getAuctions, getAuctionById, updateAuction}