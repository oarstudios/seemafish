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
}).array('review', 10);


module.exports = upload;
