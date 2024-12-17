const {attachImage, uploadImage}=require("../controller/prac-register-controller")
const express = require("express");
const router = express.Router();
// router.post("/image",uploadImage,attachImage)
router.post("/image",attachImage,uploadImage)
module.exports=router;