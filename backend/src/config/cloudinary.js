import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.user.role === 'Farmer'
      ? 'agrolk/farms'
      : req.user.role === 'Guide'
      ? 'agrolk/guides'
      : 'agrolk/transports';
    return { folder, resource_type: 'image' };
  },
});

const upload = multer({ storage });

export default upload;