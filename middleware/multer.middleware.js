import multer from "multer";
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        return cb(null, "./uploads")
    },
    filename:function(req,file,cb){
        return cb(null, `${Date.now()}/${file.originalname}`)
    }
})
const upload = multer({storage: storage});
export default upload
const logFileUpload = (req, res, next) => {
    // Check if file is present in the request
    if (req.file) {
        console.log("File received:", req.file);
    } else {
        console.log("No file received");
    }
    next(); // Call the next middleware function
};

export { logFileUpload };
