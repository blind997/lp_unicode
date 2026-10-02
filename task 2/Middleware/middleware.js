import jwt from "jsonwebtoken";

const middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];
    try{
    const decode = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );

    req.userId = decode.userId;

    next();
}
catch(error){
    return res.json({
        message:"invalid or expired token"
    })
}
};

export default middleware;