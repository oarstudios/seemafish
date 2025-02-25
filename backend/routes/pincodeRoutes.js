const express = require('express');
const router = express.Router();
const pincodeController = require('../controllers/pincodeController');

router.post('/', pincodeController.createPincode);
router.get('/', pincodeController.getAllPincodes);
router.get('/:id', pincodeController.getPincodeById);
router.put('/:id', pincodeController.updatePincode);
router.delete('/:id', pincodeController.deletePincode);

module.exports = router;
