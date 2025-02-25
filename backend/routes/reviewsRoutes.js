const {
    addReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
    getAllReviews,
  } = require('../controllers/reviewController');
  const upload = require('../middlewares/uploadReview');
  
  const express = require('express');
  
  const router = express.Router();
  
  // Corrected middleware usage for handling multiple files
  router.post('/createreview/:id', upload, addReview);
  
  router.get('/getproductreview/:id', getReviewsByProduct);

  router.get('/getallreviews', getAllReviews)
  
  router.patch('/updatereview', updateReview);
  
  router.delete('/deletereview', deleteReview);
  
  module.exports = router;
  