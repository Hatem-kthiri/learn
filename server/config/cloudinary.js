const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const makeUploader = (folder, formats = ["jpg", "png", "gif", "webp"]) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: formats,
      public_id: () => `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    },
  });
  return multer({ storage });
};

module.exports = { cloudinary, makeUploader };
