const express = require('express');
const router = express.Router();
const billingController = require('../controllers/orderController'); // Adjust the path as needed

// Create a new billing document
router.post('/:userId', billingController.createBilling);

// Get all billing documents
router.get('/', billingController.getAllBillings);

// Get a billing document by ID
router.get('/:id', billingController.getBillingById);

// Update a billing document by ID
router.put('/:id/:userId', billingController.updateBilling);

// Delete a billing document by ID
router.delete('/:id', billingController.deleteBilling);

module.exports = router;
