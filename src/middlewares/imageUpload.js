const multer = require('multer');

const imageUploadMiddleware = (dynamicePath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('====================================');
      console.log(file);
      console.log('====================================');
      cb(null, `./public/${dynamicePath}/`);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  });

  const upload = multer({ storage });
  const uploadMiddleware = upload.single('image');
  return uploadMiddleware;
};
module.exports = imageUploadMiddleware;
