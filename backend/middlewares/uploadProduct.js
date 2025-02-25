const multer = require('multer');

// Set storage engine
let storage = multer.diskStorage({
  destination: './uploads', 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Init upload
const uploadProduct = multer({
  storage: storage,
}).array('productImages', 3);

module.exports = uploadProduct;


