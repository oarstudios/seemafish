const multer = require('multer');

// Set storage engine
let storage = multer.diskStorage({
  destination: './uploads', 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).array('review', 10);


module.exports = upload;
