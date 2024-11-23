import multer from 'multer';

// Set up disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  }
});

// Create Multer instance with disk storage
const upload = multer({ storage: storage });

export default upload;
