import multer from "multer";
import path from "path";

// Set up multer storage
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/");
   },
   filename: function (req, file, cb) {
      cb(
         null,
         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
   },
});

// File filter to allow only images
const checkFilterFile = (req, file, cb) => {
   try {
       if (file.mimetype.startsWith("image/")) {
      cb(null, true);
   } else {
      cb(new Error("Only image files are allowed!"), false);
   }
   } catch (error) {
      cb(new Error("Internal error while checking file type"), false);
      return;
      
   }
  
};

// Multer uploader configuration
const uploader = multer({
   storage: storage,
   fileFilter: checkFilterFile,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
});

export default uploader;