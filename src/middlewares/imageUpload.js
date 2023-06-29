const multer = require('multer');
const path = require('path');

const imageUploadMiddleware = (dynamicePath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./public/${dynamicePath}/`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  const upload = multer({ storage });
  const uploadMiddleware = upload.single('image');
  return uploadMiddleware;
};
module.exports = imageUploadMiddleware;
