const Billing = require('../models/OrderModel'); // Adjust path as needed

// Create a new billing document
exports.createBilling = async (req, res) => {
    try {
      //console.log("Received request data:", req.body);
      //console.log("Received userId:", req.params.userId);
  
      if (!req.body.products || !Array.isArray(req.body.products)) {
        return res.status(400).json({ message: "Invalid products data" });
      }
  
      const formattedProducts = req.body.products.map(item => {
        if (!item?.productId?._id) {
          console.error("Invalid product data:", item);
        }
        return {
          product: item?.productId?._id, 
          quantity: item?.quantity,
          price: item?.productId?.price?.sale
        };
      });
  
      const newBilling = new Billing({
        userId: req.params.userId,
        products: formattedProducts,
        ...req.body
      });
  
      const savedBilling = await newBilling.save();
      res.status(201).json({ success: true, data: savedBilling });
  
    } catch (error) {
      console.error("Error in createBilling:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// Get all billing documents
exports.getAllBillings = async (req, res) => {
    try {
        const billings = await Billing.find()
            .populate('userId') // Adjust fields as needed
            .populate('products.product');
        res.status(200).json({
            success: true,
            data: billings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billings',
            error: error.message,
        });
    }
};

// Get a billing document by ID
exports.getBillingById = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await Billing.findById(id)
            .populate('userId')
            .populate('products.product');

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found',
            });
        }

        res.status(200).json({
            success: true,
            data: billing,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billing',
            error: error.message,
        });
    }
};

// Update a billing document by ID
exports.updateBilling = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const updates = { ...req.body, userId };
        const updatedBilling = await Billing.findByIdAndUpdate(id, updates, { new: true })
            .populate('userId', 'name email')
            .populate('products.product', 'name price');

        if (!updatedBilling) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Billing updated successfully',
            data: updatedBilling,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update billing',
            error: error.message,
        });
    }
};

// Delete a billing document by ID
exports.deleteBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBilling = await Billing.findByIdAndDelete(id);

        if (!deletedBilling) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Billing deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete billing',
            error: error.message,
        });
    }
};
