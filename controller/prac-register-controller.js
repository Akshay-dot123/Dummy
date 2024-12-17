const multer = require('multer');
const path = require('path');
const fs=require("fs")
const models = require("../models");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log("Creating the directory");
    }
    cb(null, uploadDir);  // Set the folder for uploaded images
  },
  filename: (req, file, cb) => {
    // Set a unique filename (e.g., current timestamp + original extension)
    cb(null, Date.now() + path.basename(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);  // Accept the file
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));  // Reject the file
    }
  };

const upload = multer({ storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
 });

const uploadImage = upload.single('image');  // assuming you upload with 'image' as the form field name

// Function to attach image (e.g., save image details to a database)
const attachImage =async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  // Example: Attaching image URL to a mock database object
  const imageUrl = `/uploads/${req.file.filename}`;
  console.log("imageUrl==============>",req.file.filename)
  try {
      let a=await models.Register.create({
        image:req.file.filename,
        // email: req.body.email
      })
      console.log("a================",a);
  } catch (error) {
    if(error.name == "SequelizeValidationError"){
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: error.errors[0].message });
    }
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: imageUrl  // Send the image URL back to the client
  });
};

// Export the upload and attach functions
module.exports = {
  uploadImage,
  attachImage
};
