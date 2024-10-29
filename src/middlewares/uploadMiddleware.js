import multer from 'multer';
import storage from '../configs/cloudynary.js';
import { BadRequestException } from '../errors/customException.js';

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedMimes.includes(file.mimetype)) {
    cb(
      new BadRequestException('JPG, PNG 형식의 이미지만 업로드 가능합니다.'),
      false
    );
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // 단일 파일만
  },
});

export default upload;
