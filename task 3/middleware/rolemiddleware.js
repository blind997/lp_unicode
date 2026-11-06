const authorize =(role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.userRole)){
            return res.status(403).json({
                message:"access denied"
            })
        }
     next();
    };

};
export default authorize
// this middleware checks whethe a user has permission to perfom action based on role
// ie if they are buyer they cant channge stuff, if they are either admin  or seller they can change stuff.