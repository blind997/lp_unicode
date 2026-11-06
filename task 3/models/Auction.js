import mongoose from "mongoose";
const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    startingPrice: {
        type: Number,
        required: true,
        min: 1
    },
    images: {
        type: [
            {
                url:{
                    type:String,
                    required: true
                },
                public_id:{
                    type: String,
                    required: true
                }
            }
        ],
        default:[]
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["UPCOMING", "ACTIVE", "ENDED"],
        default: "UPCOMING"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",//stores Mongodb user id rather than sellers entire usr doc
        required: true
    }
}, {
    timestamps: true
});

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;
