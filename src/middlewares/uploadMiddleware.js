import multer from 'multer';
import storage from '../configs/cloudynary.js';
import { BadRequestException } from '../errors/customException.js';

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new BadRequestException('이미지 파일만 업로드 가능합니다.'), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB까지만
  },
});

export default upload;
