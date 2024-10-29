import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 500, height: 500, crop: 'fill' },
      { quality: 'auto:good' }, // 이미지 최적화
    ],
    format: 'jpg', // 일관된 포맷으로 저장
    public_id: (req, file) => {
      // 파일명 난수화
      return `user-${req.user.userId}-${Date.now()}`;
    },
  },
});
export default storage;
