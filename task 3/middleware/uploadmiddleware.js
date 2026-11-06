import multer from "multer"

const storage= multer.memoryStorage();//stores images in memory
const upload= multer({
    storage,limits:{
        fileSize:5*1024*1024,//5Mb per file
        files:5
    },fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){//starts with checks whether a string begins with a specief substring
            cb(null,true)
        }
        else{
            cb(new Error("only images allowed"))
        }
    }
});
export default upload;
//mimtype tells what kind of content a file claims to be 
//mimetype is a content type label ie checks first page before .png etc